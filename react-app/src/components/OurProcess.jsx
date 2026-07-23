import "../styles/OurProcess.css";

const steps = [
  {
    number: "01",
    title: "Pick The Yarn",
    text: "Every piece starts with hand-selected, soft-touch yarn in colors chosen to last, not just to trend.",
  },
  {
    number: "02",
    title: "Stitched By Hand",
    text: "Each loop is crocheted one at a time, no machines involved, just steady hands and a few hours of quiet.",
  },
  {
    number: "03",
    title: "Wrapped With Care",
    text: "Finished pieces are inspected, tied off and packed gently before they begin their journey to you.",
  },
];

function OurProcess() {
  return (
    <section className="process-section">
      <div className="process-header">
        <h2>From Skein To Story</h2>
        <p>Three unhurried steps, the same way every single time.</p>
      </div>

      <div className="process-row">
        {steps.map((step) => (
          <div className="process-step" key={step.number}>
            <span className="process-number">{step.number}</span>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default OurProcess;