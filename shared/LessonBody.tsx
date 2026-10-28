import { lessonBlocks } from './lesson-blocks';

export default function LessonBody({ body, heading }: { body: string; heading: string }) {
  return <>{lessonBlocks(body).map((block, index) => block.type === 'text'
    ? <p key={index}>{block.text}</p>
    : <div className="cp-table-wrap" role="region" aria-label={`${heading} comparison`} tabIndex={0} key={index}><table><caption>{heading}</caption><thead><tr>{block.headers.map((header, column) => <th scope="col" key={column}>{header}</th>)}</tr></thead><tbody>{block.rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, column) => <td key={column}>{cell}</td>)}</tr>)}</tbody></table></div>)}</>;
}
