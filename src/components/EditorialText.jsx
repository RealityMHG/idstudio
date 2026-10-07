import { Fragment } from 'react';

// Explicit editorial lines keep art direction stable without measuring fonts.
// The unsplit text remains available to screen readers, search and selection.
export default function EditorialText({ as: Tag = 'h2', lines, children, mode = 'lines', className = '' }) {
  const text = lines ? lines.join(' ') : children;
  const pieces = lines || text.split(' ');

  return (
    <Tag className={`editorial-text ${className}`} data-reveal={mode}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="editorial-text__visual">
        {pieces.map((piece, index) => (
          <Fragment key={`${index}-${piece}`}>
            <span className="editorial-text__mask">
              <span className="editorial-text__piece" style={{ '--piece-index': index }}>{piece}</span>
            </span>
            {mode === 'words' && index < pieces.length - 1 ? ' ' : null}
          </Fragment>
        ))}
      </span>
    </Tag>
  );
}
