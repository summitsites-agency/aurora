export default function QuantityStepper({ qty, onChange, label }) {
  return (
    <span className="qty" role="group" aria-label={`Quantity, ${label}`}>
      <button type="button" onClick={() => onChange(qty - 1)} aria-label={`Decrease quantity of ${label}`}>−</button>
      <span aria-live="polite">{qty}</span>
      <button type="button" onClick={() => onChange(qty + 1)} aria-label={`Increase quantity of ${label}`}>+</button>
    </span>
  );
}
