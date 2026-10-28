export type LessonBlock = { type: 'text'; text: string } | { type: 'table'; headers: string[]; rows: string[][] };

/** Small, text-only lesson format. HTML and unsupported Markdown remain escaped text. */
export function lessonBlocks(body: string): LessonBlock[] {
  const lines = body.replaceAll('\r\n', '\n').split('\n');
  const blocks: LessonBlock[] = [];
  let text: string[] = [];
  const cells = (line: string) => line.trim().slice(1, -1).split('|').map(cell => cell.trim());
  const tableLine = (line: string) => /^\s*\|.*\|\s*$/.test(line);
  const flush = () => { const paragraph = text.join('\n').trim(); if (paragraph) blocks.push({ type: 'text', text: paragraph }); text = []; };
  for (let index = 0; index < lines.length; index++) {
    const header = lines[index];
    const separator = lines[index + 1];
    if (tableLine(header) && separator && tableLine(separator)) {
      const headers = cells(header);
      const rules = cells(separator);
      if (headers.length > 1 && headers.length === rules.length && rules.every(rule => /^:?-{3,}:?$/.test(rule))) {
        const rows: string[][] = [];
        let end = index + 2;
        while (end < lines.length && tableLine(lines[end])) { rows.push(cells(lines[end])); end++; }
        if (rows.length && rows.every(row => row.length === headers.length)) {
          flush(); blocks.push({ type: 'table', headers, rows }); index = end - 1; continue;
        }
      }
    }
    if (!lines[index].trim()) flush(); else text.push(lines[index]);
  }
  flush();
  return blocks;
}
