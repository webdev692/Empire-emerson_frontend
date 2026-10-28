import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { closeSync, existsSync, openSync, readFileSync, realpathSync, writeFileSync } from 'node:fs';
import { createServer as createNetServer } from 'node:net';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const script = fileURLToPath(import.meta.url);
const appRoot = resolve(dirname(script), '..');
const workspace = resolve(appRoot, '../../..');
const node = join(workspace, '.tools/node-v22.23.1-win-x64/node.exe');
const state = resolve(appRoot, '../../THE-EMERSON-EMPIRE_Backend/.local-synthetic');
const recordFile = join(state, 'frontend-process.json');
const origin = 'http://127.0.0.1:58080';
const action = process.argv[2];

function cleanEnv() {
  const result = {};
  for (const key of ['SystemRoot', 'WINDIR', 'COMSPEC', 'PATH', 'TEMP', 'TMP', 'USERPROFILE', 'USERNAME', 'USERDOMAIN', 'APPDATA', 'LOCALAPPDATA']) {
    if (process.env[key]) result[key] = process.env[key];
  }
  return result;
}

function readRecord() {
  if (!existsSync(recordFile)) return null;
  const record = JSON.parse(readFileSync(recordFile, 'utf8'));
  assert.ok(Number.isSafeInteger(record.pid) && record.pid > 0, 'Invalid frontend process record');
  assert.equal(record.script, script, 'Unexpected frontend launcher');
  assert.equal(record.appRoot, appRoot, 'Unexpected frontend checkout');
  assert.equal(record.node, node, 'Unexpected frontend runtime');
  return record;
}

function ownedProcess(record) {
  if (!record) return false;
  // Check executable AND command line before touching a persisted PID, which Windows can reuse.
  const query = `$item=Get-CimInstance Win32_Process -Filter 'ProcessId=${record.pid}'; if($item){$item | Select-Object ExecutablePath,CommandLine | ConvertTo-Json -Compress}`;
  const result = spawnSync('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', query], {
    env: cleanEnv(), encoding: 'utf8', windowsHide: true,
  });
  assert.equal(result.status, 0, 'Unable to inspect frontend process identity');
  if (!result.stdout.trim()) return false;
  const details = JSON.parse(result.stdout);
  return details.ExecutablePath?.toLowerCase() === node.toLowerCase()
    && details.CommandLine?.includes(script) && /(?:^|\s)serve(?:\s|$)/.test(details.CommandLine);
}

async function ready() {
  try {
    const response = await fetch(origin, { signal: AbortSignal.timeout(1500), redirect: 'error' });
    return response.ok && response.headers.get('X-EPDG-Environment') === 'synthetic-local'
      && (await response.text()).includes('/src/synthetic/main.tsx');
  } catch { return false; }
}

async function portFree() {
  await new Promise((accept, reject) => {
    const probe = createNetServer();
    probe.once('error', () => reject(new Error('Synthetic frontend port is occupied; no process was replaced.')));
    probe.listen(58080, '127.0.0.1', () => probe.close(accept));
  });
}

async function start() {
  const record = readRecord();
  if (ownedProcess(record)) {
    assert.ok(await ready(), 'Managed frontend exists but is not ready; inspect private frontend logs');
    console.log(JSON.stringify({ status: 'ready', origin, pid: record.pid }));
    return;
  }
  assert.ok(existsSync(join(appRoot, 'src/synthetic/main.tsx')), 'Synthetic frontend entry is not prepared');
  await portFree();
  const output = openSync(join(state, 'frontend.out.log'), 'a');
  const error = openSync(join(state, 'frontend.err.log'), 'a');
  let child;
  try {
    child = spawn(node, [script, 'serve'], {
      cwd: appRoot, env: cleanEnv(), detached: true, windowsHide: true,
      stdio: ['ignore', output, error],
    });
    await new Promise((accept, reject) => { child.once('error', reject); child.once('spawn', accept); });
    writeFileSync(recordFile, JSON.stringify({ pid: child.pid, node, script, appRoot, origin, startedAt: new Date().toISOString() }, null, 2) + '\n');
    child.unref();
  } finally {
    closeSync(output);
    closeSync(error);
  }
  for (let attempt = 0; attempt < 45; attempt++) {
    if (await ready()) {
      console.log(JSON.stringify({ status: 'ready', origin, pid: child.pid }));
      return;
    }
    await new Promise(accept => setTimeout(accept, 200));
  }
  throw new Error('Synthetic frontend did not become ready; inspect private frontend logs');
}

async function serve() {
  // The child receives OS variables only, never inherited production/provider settings.
  const { createServer } = await import('vite');
  const server = await createServer({ root: appRoot, mode: 'synthetic-local', logLevel: 'error', clearScreen: false });
  await server.listen();
  console.log(`Synthetic frontend listening on ${origin}`);
  for (const signal of ['SIGTERM', 'SIGINT']) process.once(signal, async () => { await server.close(); process.exit(0); });
}

try {
  assert.equal(process.platform, 'win32', 'This launcher is for the pinned Windows synthetic environment');
  assert.equal(process.version, 'v22.23.1', 'Use the pinned Node.js 22.23.1 executable');
  assert.equal(realpathSync(process.execPath).toLowerCase(), realpathSync(node).toLowerCase(), 'Use the workspace Node.js executable');
  assert.ok(existsSync(join(state, 'runtime.json')), 'Prepare the isolated backend first; its private state directory is required');
  assert.ok(['start', 'status', 'stop', 'serve'].includes(action) && process.argv.length === 3, 'Specify start, status, or stop');
  if (action === 'start') await start();
  else if (action === 'serve') await serve();
  else {
    const record = readRecord();
    const running = ownedProcess(record);
    if (action === 'stop') {
      if (running) process.kill(record.pid);
      console.log(JSON.stringify({ status: running ? 'stopped' : 'not-running', origin }));
    } else console.log(JSON.stringify({ status: running ? (await ready() ? 'ready' : 'not-ready') : 'not-running', origin, pid: running ? record.pid : null }));
  }
} catch (error) {
  console.error(error instanceof assert.AssertionError ? error.message.split('\n')[0] : error instanceof Error ? error.message : 'Synthetic frontend command failed');
  process.exitCode = 1;
}
