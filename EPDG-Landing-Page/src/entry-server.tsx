/// <reference types="node" />
import { renderToPipeableStream } from 'react-dom/server';
import { PassThrough } from 'node:stream';
import App from './App';
import { publicPages } from './PublicPages';
export const routes = publicPages.map(({path,title,description})=>({path,title,description}));
export function render(pathname: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const output = new PassThrough();
    let html = '';
    output.on('data', chunk => { html += chunk.toString(); });
    output.on('end', () => resolve(html));
    output.on('error', reject);
    const stream = renderToPipeableStream(<App pathname={pathname} />, { onAllReady() { stream.pipe(output); }, onError(error) { reject(error); } });
  });
}
export { epdgScholarlyData as scholarlyData } from './ModernContent';
