import { Eyebrow } from "./Eyebrow";

const layers = [
  { step: "01", title: "Business rules", detail: "FDL · FieldType · Record · Recordset" },
  { step: "02", title: "Semantic state", detail: "required · visible · disabled · valid" },
  { step: "03", title: "Accessible component", detail: "labels · controls · focus · events" },
  { step: "04", title: "Visual theme", detail: "layout · type · color · density" },
];

export function ArchitectureStrip() {
  return (
    <section className="architecture-section" aria-labelledby="architecture-title">
      <div className="shell">
        <div className="architecture-heading">
          <Eyebrow>Dependency direction</Eyebrow>
          <h2 id="architecture-title">Meaning moves forward. Presentation never reaches back.</h2>
        </div>
        <ol className="architecture-flow">
          {layers.map((layer, index) => (
            <li key={layer.title}>
              <span className="architecture-step">{layer.step}</span>
              <div>
                <strong>{layer.title}</strong>
                <span>{layer.detail}</span>
              </div>
              {index < layers.length - 1 && <span className="flow-arrow" aria-hidden="true">→</span>}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
