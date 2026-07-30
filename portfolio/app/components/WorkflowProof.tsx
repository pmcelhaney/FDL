const outputs = ["Input", "Validation", "Review", "Export"];

export function WorkflowProof() {
  return (
    <div className="workflow-proof" aria-label="One FDL payment field definition drives four product surfaces">
      <div className="proof-topline">
        <span>Payment rule / live contract</span>
        <span className="status-dot">Model active</span>
      </div>
      <div className="rule-window">
        <div className="line-numbers" aria-hidden="true">01<br />02<br />03<br />04</div>
        <code>
          <span className="code-muted">const</span> routingNumber = string<br />
          &nbsp;&nbsp;.with.formatter(achRouting)<br />
          &nbsp;&nbsp;.thatIs.requiredWhen(isACH)<br />
          &nbsp;&nbsp;.and.validator(validRouting);
        </code>
      </div>
      <div className="proof-rail" aria-hidden="true">
        <span className="rail-pulse" />
      </div>
      <div className="output-grid">
        {outputs.map((output, index) => (
          <div className="output-node" key={output}>
            <span className="node-icon" aria-hidden="true">0{index + 1}</span>
            <strong>{output}</strong>
            <span>{index === 0 ? "Required" : index === 1 ? "9 digits" : index === 2 ? "•••• 0210" : "ACH detail"}</span>
          </div>
        ))}
      </div>
      <div className="proof-caption">
        <span>Context: paymentMethod = ACH</span>
        <span className="signal-label">4 consumers aligned</span>
      </div>
    </div>
  );
}
