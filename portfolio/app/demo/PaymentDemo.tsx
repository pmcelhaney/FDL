"use client";

import { useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import styles from "./demo.module.css";
import {
  activeRule,
  errorsFor,
  fieldDefinitions,
  initialPayment,
  isDisabled,
  isRequired,
  isVisible,
  jurisdictions,
  samplePayments,
  type FieldDefinition,
  type FieldKey,
  type Payment,
} from "./model";

type SortDirection = "ascending" | "descending";
type SortState = { key: FieldKey; direction: SortDirection };

const tableFields = fieldDefinitions.filter((field) => field.table);

function display(definition: FieldDefinition, record: Payment, context: "display" | "export" = "display") {
  return definition.format(record[definition.key] as never, context);
}

function escapeCsv(value: string) {
  return `"${value.replaceAll('"', '""')}"`;
}

export default function PaymentDemo() {
  const [payment, setPayment] = useState<Payment>(initialPayment);
  const [rawInputs, setRawInputs] = useState<Record<FieldKey, string>>(() =>
    Object.fromEntries(fieldDefinitions.map((field) => [field.key, field.format(initialPayment[field.key] as never, "input")])) as Record<FieldKey, string>,
  );
  const [touched, setTouched] = useState<Set<FieldKey>>(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [announcement, setAnnouncement] = useState("North Carolina policy loaded.");
  const [sort, setSort] = useState<SortState>({ key: "id", direction: "ascending" });
  const [widths, setWidths] = useState<Record<string, number>>(() =>
    Object.fromEntries(tableFields.map((field) => [field.key, field.width ?? 160])),
  );
  const resizeRef = useRef<{ key: FieldKey; startX: number; startWidth: number } | null>(null);

  const errors = useMemo(() => errorsFor(payment), [payment]);
  const shownErrors = errors.filter((error) => submitted || touched.has(error.key));
  const highlighted = activeRule(payment);

  const records = useMemo(() => {
    const current = { ...payment };
    return [current, ...samplePayments.filter((record) => record.id !== current.id)].sort((a, b) => {
      const definition = tableFields.find((field) => field.key === sort.key)!;
      const av = a[sort.key];
      const bv = b[sort.key];
      const comparison = definition.numeric
        ? Number(av ?? 0) - Number(bv ?? 0)
        : display(definition, a).localeCompare(display(definition, b), undefined, { numeric: true });
      return sort.direction === "ascending" ? comparison : -comparison;
    });
  }, [payment, sort]);

  function updateField(definition: FieldDefinition, input: string) {
    const parsed = definition.parse(input) as never;
    setRawInputs((current) => ({ ...current, [definition.key]: input }));
    setPayment((current) => {
      const next = { ...current, [definition.key]: parsed } as Payment;
      if (definition.key === "destinationState") {
        const agencyField = fieldDefinitions.find((field) => field.key === "agency")!;
        const nextAgency = agencyField.options?.(next)[0]?.value ?? "";
        next.agency = nextAgency;
        setRawInputs((raw) => ({ ...raw, agency: nextAgency }));
        const jurisdiction = jurisdictions.find((option) => option.value === input)?.label ?? input;
        setAnnouncement(`${jurisdiction} policy loaded. Receiving-agency options were updated${input === "PR" ? "; compliance reference is now required" : ""}.`);
      }
      if (definition.key === "method") {
        const message = input === "Paper check"
          ? "Paper check policy loaded. Bank fields are now hidden."
          : input === "International wire"
            ? "International wire policy loaded. Routing, account, and compliance reference are required."
            : "ACH policy loaded. Nine-digit routing and account fields are required.";
        setAnnouncement(message);
      }
      if (definition.key === "status") {
        setAnnouncement(input === "Approved" ? "Approved policy loaded. Financial fields are now locked." : `${input} status loaded. Financial fields can be edited.`);
      }
      return next;
    });
  }

  function selectJurisdiction(value: string) {
    const definition = fieldDefinitions.find((field) => field.key === "destinationState")!;
    updateField(definition, value);
    setTouched((current) => new Set(current).add("destinationState"));
  }

  function sortBy(key: FieldKey) {
    setSort((current) => ({
      key,
      direction: current.key === key && current.direction === "ascending" ? "descending" : "ascending",
    }));
  }

  function resizeBy(key: FieldKey, delta: number) {
    setWidths((current) => ({ ...current, [key]: Math.min(360, Math.max(104, current[key] + delta)) }));
  }

  function onResizeKey(event: KeyboardEvent<HTMLDivElement>, key: FieldKey) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      resizeBy(key, event.shiftKey ? -32 : -12);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      resizeBy(key, event.shiftKey ? 32 : 12);
    } else if (event.key === "Home") {
      event.preventDefault();
      setWidths((current) => ({ ...current, [key]: 104 }));
    } else if (event.key === "End") {
      event.preventDefault();
      setWidths((current) => ({ ...current, [key]: 360 }));
    }
  }

  function onResizeStart(event: PointerEvent<HTMLDivElement>, key: FieldKey) {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    resizeRef.current = { key, startX: event.clientX, startWidth: widths[key] };
  }

  function onResizeMove(event: PointerEvent<HTMLDivElement>) {
    const active = resizeRef.current;
    if (!active) return;
    setWidths((current) => ({
      ...current,
      [active.key]: Math.min(360, Math.max(104, active.startWidth + event.clientX - active.startX)),
    }));
  }

  function downloadCsv() {
    const rows = [
      tableFields.map((field) => escapeCsv(field.label)).join(","),
      ...records.map((record) => tableFields.map((field) => escapeCsv(display(field, record, "export"))).join(",")),
    ];
    const blob = new Blob([rows.join("\r\n")], { type: "text/csv;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "fictional-child-support-payments.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  }

  function validate(event: React.FormEvent) {
    event.preventDefault();
    setSubmitted(true);
    if (errors.length) {
      requestAnimationFrame(() => document.getElementById("error-summary")?.focus());
    } else {
      setAnnouncement("Payment is ready for review. All active policy rules pass.");
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.noPrint}>
        <section className={styles.hero} aria-labelledby="demo-title">
          <div className={styles.eyebrow}>FDL / Product proof 01</div>
          <div className={styles.heroGrid}>
            <div>
              <h1 id="demo-title">One payment policy.<br />Every surface in sync.</h1>
              <p className={styles.lede}>Child-support operations teams disburse across jurisdictions, agencies, and ACH destinations. When every form, validator, review grid, and export copies the rules, small policy changes drift into expensive exceptions.</p>
            </div>
            <aside className={styles.problemCard}>
              <p className={styles.kicker}>The operations problem</p>
              <p>North Carolina needs county-specific destinations. Puerto Rico adds an exception reference. ACH requires domestic bank fields; a paper check does not. Approval locks the money movement.</p>
              <p className={styles.cardFoot}>This interactive scenario keeps those decisions in one field-definition array.</p>
            </aside>
          </div>
        </section>

        <nav className={styles.guide} aria-label="Demo guide">
          <span>Try the policy chain</span>
          <ol>
            <li><a href="#policy">Change jurisdiction</a></li>
            <li><a href="#payment-form">Clear a required field</a></li>
            <li><a href="#review">Sort or resize</a></li>
            <li><a href="#export">Print or export</a></li>
          </ol>
        </nav>

        <section className={styles.policy} id="policy" aria-labelledby="policy-title">
          <div className={styles.sectionHeading}>
            <div><span className={styles.step}>01 / Policy switch</span><h2 id="policy-title">Move the destination. Watch the contract respond.</h2></div>
            <p>Jurisdiction changes dependent agency options. Puerto Rico also reveals a required compliance reference.</p>
          </div>
          <div className={styles.policySwitch} role="group" aria-label="Destination jurisdiction policy">
            {jurisdictions.map((option) => (
              <button key={option.value} type="button" className={payment.destinationState === option.value ? styles.policyActive : ""} aria-pressed={payment.destinationState === option.value} onClick={() => selectJurisdiction(option.value)}>
                <span>{option.value}</span>{option.label}
              </button>
            ))}
          </div>
          <p className={styles.live} role="status" aria-live="polite">{announcement}</p>
        </section>

        <div className={styles.workbench}>
          <section className={styles.formPanel} aria-labelledby="form-title">
            <div className={styles.panelTop}><span className={styles.step}>02 / Edit</span><span className={styles.adapter}>Scenario adapter</span></div>
            <h2 id="form-title">Create a disbursement</h2>
            <p className={styles.disclaimer}>All people, accounts, agencies, and payment records shown here are fictional. Do not enter real sensitive data.</p>

            {shownErrors.length > 0 && (
              <div className={styles.errorSummary} id="error-summary" tabIndex={-1} role="alert" aria-labelledby="error-heading">
                <strong id="error-heading">Check {shownErrors.length} {shownErrors.length === 1 ? "field" : "fields"}</strong>
                <ul>{shownErrors.map((error) => <li key={error.key}><a href={`#field-${error.key}`}>{error.label}: {error.message}</a></li>)}</ul>
              </div>
            )}

            <form id="payment-form" onSubmit={validate} noValidate>
              <div className={styles.formGrid}>
                {fieldDefinitions.filter((field) => field.key !== "id" && isVisible(field, payment)).map((field) => {
                  const required = isRequired(field, payment);
                  const disabled = isDisabled(field, payment);
                  const error = shownErrors.find((item) => item.key === field.key);
                  const options = field.options?.(payment) ?? [];
                  const describedBy = [field.hint ? `hint-${field.key}` : "", error ? `error-${field.key}` : ""].filter(Boolean).join(" ");
                  return (
                    <div className={`${styles.field} ${field.key === "complianceReference" ? styles.fieldWide : ""}`} key={field.key}>
                      <label htmlFor={`field-${field.key}`}>{field.label}{required && <span className={styles.required}> required</span>}</label>
                      {field.control === "select" ? (
                        <select id={`field-${field.key}`} value={String(payment[field.key] ?? "")} required={required} disabled={disabled} aria-invalid={Boolean(error)} aria-describedby={describedBy || undefined} onChange={(event) => updateField(field, event.target.value)} onBlur={() => setTouched((current) => new Set(current).add(field.key))}>
                          {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                        </select>
                      ) : (
                        <input id={`field-${field.key}`} value={rawInputs[field.key]} required={required} disabled={disabled} inputMode={field.inputMode} autoComplete="off" aria-invalid={Boolean(error)} aria-describedby={describedBy || undefined} onChange={(event) => updateField(field, event.target.value)} onBlur={() => setTouched((current) => new Set(current).add(field.key))} />
                      )}
                      {field.hint && <small id={`hint-${field.key}`}>{field.hint}</small>}
                      {error && <span className={styles.inlineError} id={`error-${field.key}`}>{error.message}</span>}
                      {(field.key === "amount" || field.key === "routingNumber" || field.key === "complianceReference") && (
                        <span className={styles.valueTrace}><b>Typed</b> {rawInputs[field.key] || "(empty)"} <i>→</i> <b>Model</b> {String(payment[field.key] ?? "null")}</span>
                      )}
                    </div>
                  );
                })}
              </div>
              <button className={styles.primaryButton} type="submit">Validate payment</button>
            </form>
          </section>

          <aside className={styles.definitionPanel} aria-labelledby="definition-title">
            <div className={styles.panelTop}><span className={styles.step}>03 / Inspect</span><span className={styles.greenDot}>active rule</span></div>
            <h2 id="definition-title">The definition changed once.</h2>
            <p>The adapter evaluates the same labels, options, predicates, parsers, formatters, and validators for every surface below.</p>
            <pre className={styles.code} aria-label="Active field-definition excerpt"><code>{fieldDefinitions.filter((field) => ["agency", "routingNumber", "amount", "complianceReference"].includes(field.key)).map((field) => (
              <span key={field.key} className={field.key === highlighted.key ? styles.codeActive : ""}><i>{field.key === highlighted.key ? "ACTIVE" : "      "}</i>{field.key}: field(&quot;{field.label}&quot;)<br />      {field.rule}<br /></span>
            ))}</code></pre>
            <div className={styles.ruleExplain}><b>{highlighted.label}</b><span>{highlighted.rule}</span></div>
            <p className={styles.honesty}><b>Implementation note:</b> this portfolio route uses a transparent, client-side scenario adapter that mirrors FDL’s declarative semantics. It does not claim to execute the core package across the site’s build boundary.</p>
          </aside>
        </div>

        <section className={styles.validation} aria-labelledby="validation-title">
          <div><span className={styles.step}>04 / Validate</span><h2 id="validation-title">One error inventory, explained in operations language.</h2></div>
          <div className={styles.validationStats}><strong>{errors.length}</strong><span>active {errors.length === 1 ? "issue" : "issues"}</span></div>
          <ul className={styles.validationList}>
            {errors.length ? errors.map((error) => <li key={error.key}><span>{error.label}</span><b>{error.message}</b></li>) : <li className={styles.validRow}><span>Policy check</span><b>All visible, required fields pass.</b></li>}
          </ul>
        </section>

        <section className={styles.review} id="review" aria-labelledby="review-title">
          <div className={styles.sectionHeading}>
            <div><span className={styles.step}>05 / Review</span><h2 id="review-title">The same fields become an operations queue.</h2></div>
            <p>A Recordset-style adapter sorts model values and formats display values. Use the column headers to sort; drag the dividers or focus them and press the arrow keys to resize.</p>
          </div>
          <div className={styles.tableFrame} tabIndex={0} aria-label="Scrollable fictional payment review table">
            <table>
              <caption className={styles.srOnly}>Fictional child-support payments. Sortable and resizable columns.</caption>
              <colgroup>{tableFields.map((field) => <col key={field.key} style={{ width: `${widths[field.key]}px` }} />)}</colgroup>
              <thead><tr>{tableFields.map((field) => (
                <th key={field.key} scope="col" aria-sort={sort.key === field.key ? sort.direction : "none"} className={field.numeric ? styles.numeric : ""}>
                  <button type="button" onClick={() => sortBy(field.key)}>{field.label}<span aria-hidden="true">{sort.key === field.key ? sort.direction === "ascending" ? " ↑" : " ↓" : " ↕"}</span></button>
                  <div className={styles.resizer} role="separator" aria-label={`Resize ${field.label} column`} aria-orientation="vertical" aria-valuemin={104} aria-valuemax={360} aria-valuenow={widths[field.key]} tabIndex={0} onKeyDown={(event) => onResizeKey(event, field.key)} onPointerDown={(event) => onResizeStart(event, field.key)} onPointerMove={onResizeMove} onPointerUp={() => { resizeRef.current = null; }} onPointerCancel={() => { resizeRef.current = null; }} onDoubleClick={() => setWidths((current) => ({ ...current, [field.key]: field.width ?? 160 }))} />
                </th>
              ))}</tr></thead>
              <tbody>{records.map((record) => <tr key={record.id}>{tableFields.map((field) => <td key={field.key} className={field.numeric ? styles.numeric : ""}>{display(field, record) || "—"}</td>)}</tr>)}</tbody>
            </table>
          </div>
          <p className={styles.tableNote}>Account numbers never enter the review queue unmasked. Amount alignment comes from the field’s stable numeric presentation intent.</p>
        </section>

        <section className={styles.exportSection} id="export" aria-labelledby="export-title">
          <div className={styles.sectionHeading}>
            <div><span className={styles.step}>06 / Deliver</span><h2 id="export-title">Review, print, and export without rewriting policy.</h2></div>
            <div className={styles.actions}><button type="button" onClick={() => window.print()}>Print / save PDF</button><button type="button" onClick={downloadCsv}>Download CSV <span className={styles.srOnly}>of fictional payment records</span></button></div>
          </div>
          <PrintSheet payment={payment} />
        </section>
      </div>
      <div className={styles.printOnly}><PrintSheet payment={payment} /></div>
    </main>
  );
}

function PrintSheet({ payment }: { payment: Payment }) {
  const visible = fieldDefinitions.filter((field) => isVisible(field, payment));
  return (
    <article className={styles.printSheet} aria-label="Print preview for current fictional payment">
      <header><div><span>CHILD SUPPORT DISBURSEMENT</span><h3>Payment review</h3></div><strong>{payment.id}</strong></header>
      <div className={styles.printMeta}><span>FICTIONAL TRAINING RECORD</span><span>{payment.status}</span></div>
      <dl>{visible.map((field) => <div key={field.key}><dt>{field.label}</dt><dd className={field.numeric ? styles.numeric : ""}>{display(field, payment) || "—"}</dd></div>)}</dl>
      <footer>Generated from the same declarative scenario definition as the form, validation summary, and review table.</footer>
    </article>
  );
}
