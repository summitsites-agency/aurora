import { SIZES } from '../data/sizes.js';
import './SizeSelector.css';

export default function SizeSelector({ value, onChange, accent }) {
  return (
    <div className="sizes" role="group" aria-label="Size">
      {SIZES.map((size) => (
        <button
          key={size}
          type="button"
          className="sizes__btn u-label"
          aria-pressed={value === size}
          style={accent ? { '--accent': accent } : undefined}
          onClick={() => onChange(size)}
        >
          {size}
        </button>
      ))}
    </div>
  );
}
