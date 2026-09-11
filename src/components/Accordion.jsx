import { useId, useState } from 'react';
import './Accordion.css';

export default function Accordion({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();

  return (
    <div className="acc">
      <button
        type="button"
        className="acc__trigger u-label"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
      >
        {title}
        <span className="acc__icon" aria-hidden="true">+</span>
      </button>
      {/* The panel stays in the DOM when closed so its content remains
          findable by in-page search and by assistive tech. */}
      <div className="acc__panel" data-open={open} id={id} role="region">
        <div className="acc__inner">{children}</div>
      </div>
    </div>
  );
}
