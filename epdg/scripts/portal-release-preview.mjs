import { createServer } from 'node:https';
import { request as httpRequest } from 'node:http';
import { readFileSync, readdirSync, realpathSync } from 'node:fs';
import { resolve, relative, extname } from 'node:path';
import { createHash, X509Certificate } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { portalReleaseHeaders } from './portal-release-profile.mjs';

// Test harness only: no configurable public listener or remote API target.
export const reviewOrigin = 'https://epdg-review.localhost';
const reviewHost = 'epdg-review.localhost';
const upstreamPort = 58001;
const maxBodyBytes = 10 * 1024 * 1024;
const contentTypes = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.ico': 'image/x-icon', '.woff2': 'font/woff2' };
const securityHeaders = Object.fromEntries(portalReleaseHeaders.trim().split('\n').slice(1).map(line => { const index = line.indexOf(':'); return [line.slice(0, index).trim(), line.slice(index + 1).trim()]; }));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const fail = () => { throw new Error('The isolated HTTPS artifact or configuration could not be verified.'); };

export function loadReviewArtifact(artifactDirectory, manifestFile) {
  const root = realpathSync(artifactDirectory);
  const manifestPath = realpathSync(manifestFile);
  if (!relative(root, manifestPath).startsWith('..')) fail();
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  if (!/^[a-f0-9]{40}$/.test(manifest.sourceCommit ?? '') || manifest.profile !== 'portal-release'
    || !Array.isArray(manifest.files) || manifest.files.length < 4 || manifest.files.length > 1000) fail();
  const bytesByPath = new Map();
  function collect(directory) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      if (entry.isSymbolicLink() || entry.name.startsWith('.')) fail();
      const path = resolve(directory, entry.name);
      if (entry.isDirectory()) collect(path);
      else if (entry.isFile()) bytesByPath.set(relative(root, path).replaceAll('\\', '/'), readFileSync(path));
      else fail();
    }
  }
  collect(root);
  if (bytesByPath.size !== manifest.files.length || new Set(manifest.files.map(item => item.path)).size !== manifest.files.length) fail();
  for (const item of manifest.files) {
    const bytes = bytesByPath.get(item.path);
    if (!bytes || !/^[a-f0-9]{64}$/.test(item.sha256 ?? '') || hash(bytes) !== item.sha256) fail();
  }
  const profile = JSON.parse(bytesByPath.get('release-candidate.json')?.toString() ?? 'null');
  if (profile?.environment !== 'portal-release-candidate' || profile.portalOrigin !== reviewOrigin || profile.releaseAuthorized !== false
    || bytesByPath.get('_headers')?.toString() !== portalReleaseHeaders || !bytesByPath.has('index.html')) fail();
  for (const [name] of bytesByPath) if (!['_headers', '_redirects'].includes(name) && !contentTypes[extname(name)]) fail();
  // Keep the verified bytes in memory; later filesystem changes cannot alter a running preview.
  return { root, sourceCommit: manifest.sourceCommit, bytesByPath };
}

export function requestPath(value) {
  if (typeof value !== 'string' || value.length > 2048 || !value.startsWith('/') || value.startsWith('//')) return null;
  let pathname;
  try { pathname = decodeURIComponent(value.split('?')[0]); } catch { return null; }
  if (!/^\/[A-Za-z0-9_./-]*$/.test(pathname) || pathname.split('/').some(part => part === '.' || part === '..' || part.startsWith('.'))) return null;
  return pathname;
}

export function startPortalReleasePreview({ artifactDirectory, manifestFile, keyFile, certificateFile }) {
  const artifact = loadReviewArtifact(artifactDirectory, manifestFile);
  for (const file of [keyFile, certificateFile]) if (!relative(artifact.root, realpathSync(file)).startsWith('..')) fail();
  const cert = readFileSync(certificateFile);
  const certificate = new X509Certificate(cert);
  if (!certificate.checkHost(reviewHost) || Date.parse(certificate.validTo) <= Date.now() || Date.parse(certificate.validFrom) > Date.now()) fail();
  const server = createServer({ key: readFileSync(keyFile), cert, minVersion: 'TLSv1.2' }, (request, response) => {
    const finish = (status, message) => { if (!response.headersSent) { response.writeHead(status, { ...securityHeaders, 'Content-Type': 'text/plain; charset=utf-8' }); response.end(message); } };
    const pathname = requestPath(request.url);
    if (request.headers.host !== reviewHost || request.headers.origin && request.headers.origin !== reviewOrigin) return finish(403, 'Review origin denied.');
    if (!pathname) return finish(400, 'Invalid request path.');
    if (pathname.startsWith('/api/')) {
      if (!['GET', 'POST', 'PATCH', 'DELETE'].includes(request.method)) return finish(405, 'Method denied.');
      const headers = { host: `127.0.0.1:${upstreamPort}`, 'x-forwarded-proto': 'https', 'x-forwarded-host': reviewHost, 'x-forwarded-for': '127.0.0.1' };
      for (const name of ['accept', 'content-type', 'cookie', 'origin', 'x-csrf-token', 'x-epdg-request']) if (request.headers[name] !== undefined) headers[name] = request.headers[name];
      const upstream = httpRequest({ hostname: '127.0.0.1', port: upstreamPort, method: request.method, path: request.url, headers, timeout: 15000 }, result => {
        if (result.statusCode >= 300 && result.statusCode < 400) { result.resume(); return finish(502, 'API redirects are not permitted.'); }
        const forwarded = { ...securityHeaders };
        for (const name of ['content-type', 'set-cookie', 'retry-after']) if (result.headers[name] !== undefined) forwarded[name] = result.headers[name];
        response.writeHead(result.statusCode ?? 502, forwarded);
        result.on('error', () => response.destroy());
        result.pipe(response);
      });
      let size = 0;
      upstream.on('timeout', () => upstream.destroy());
      upstream.on('error', () => finish(502, 'Local review API unavailable.'));
      request.on('data', chunk => { size += chunk.length; if (size > maxBodyBytes) { upstream.destroy(); finish(413, 'Request too large.'); } else if (!upstream.destroyed) upstream.write(chunk); });
      request.on('end', () => upstream.end());
      request.on('aborted', () => upstream.destroy());
      response.on('close', () => { if (!response.writableFinished) upstream.destroy(); });
      return;
    }
    if (!['GET', 'HEAD'].includes(request.method)) return finish(405, 'Method denied.');
    if (pathname === '/api' || pathname.startsWith('/_')) return finish(404, 'Not found.');
    const name = pathname === '/' ? 'index.html' : pathname.slice(1);
    const file = artifact.bytesByPath.has(name) ? name : extname(name) ? null : 'index.html';
    if (!file) return finish(404, 'Not found.');
    const bytes = artifact.bytesByPath.get(file);
    response.writeHead(200, { ...securityHeaders, 'Content-Type': contentTypes[extname(file)], 'Content-Length': bytes.length });
    response.end(request.method === 'HEAD' ? undefined : bytes);
  });
  server.requestTimeout = 30000;
  server.headersTimeout = 10000;
  server.keepAliveTimeout = 5000;
  server.on('checkContinue', (_request, response) => { response.writeHead(417); response.end(); });
  server.on('upgrade', (_request, socket) => socket.destroy());
  server.listen(443, '127.0.0.1');
  return server;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  if (process.env.EPDG_PREVIEW_ACK !== 'local-synthetic-only') fail();
  const server = startPortalReleasePreview({ artifactDirectory: process.env.EPDG_PREVIEW_ARTIFACT, manifestFile: process.env.EPDG_PREVIEW_MANIFEST, keyFile: process.env.EPDG_PREVIEW_KEY, certificateFile: process.env.EPDG_PREVIEW_CERTIFICATE });
  server.on('listening', () => console.log('Isolated HTTPS artifact review is ready; native fixture trust only.'));
  server.on('error', () => { console.error('Isolated HTTPS artifact review could not start.'); process.exitCode = 1; });
  for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.close(() => process.exit(0)));
}
