/**
 * Shared SVG definitions for the sketch kit, rendered once in the root layout.
 * `sk-wobble` gives clean paths a slight hand-drawn waver; use it on lines and marks, not on text.
 */
export default function SketchDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: "absolute" }}>
      <defs>
        <filter id="sk-wobble" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves={2} seed={4} />
          <feDisplacementMap in="SourceGraphic" scale={2.4} />
        </filter>
      </defs>
    </svg>
  );
}
