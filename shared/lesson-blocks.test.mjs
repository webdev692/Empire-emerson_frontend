import test from 'node:test';
import assert from 'node:assert/strict';
import { lessonBlocks } from './lesson-blocks.ts';

test('a Work lesson comparison is a table between readable paragraphs', () => {
  const blocks = lessonBlocks('Check the source.\n| Evidence | Limit |\n| --- | --- |\n| Public page | No partnership |\n\nKeep uncertainty.');
  assert.deepEqual(blocks, [{type:'text',text:'Check the source.'},{type:'table',headers:['Evidence','Limit'],rows:[['Public page','No partnership']]},{type:'text',text:'Keep uncertainty.'}]);
});
test('incomplete comparisons retain all supplied text rather than dropping mismatched cells', () => {
  const body = '| Evidence | Limit |\n| --- | --- |\n| One | Two | Three |';
  assert.deepEqual(lessonBlocks(body), [{type:'text',text:body}]);
});
test('HTML and unknown Markdown remain plain text; CRLF and empty paragraphs normalize', () => {
  assert.deepEqual(lessonBlocks('\r\n<script>alert(1)</script>\r\n\r\n**Draft**\r\n'), [{type:'text',text:'<script>alert(1)</script>'},{type:'text',text:'**Draft**'}]);
});
