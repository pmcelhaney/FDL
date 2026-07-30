import type { Metadata } from "next";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Modifier reference | FDL",
  description: "A candid support matrix for every modifier in FDL's current builder API.",
};

type Support = "Live / implemented" | "Model-only" | "Adapter / planned";

type Modifier = {
  name: string;
  summary: string;
  support: Support;
  note?: string;
  deprecated?: boolean;
  docs?: "field-type" | "design-principles" | "adr";
};

const modifiers: Modifier[] = [
  { name: "accept", summary: "Stores an accepted-file hint for an input.", support: "Adapter / planned", deprecated: true, docs: "adr" },
  { name: "additionalProperties", summary: "Passes an arbitrary property bag toward a renderer.", support: "Adapter / planned", deprecated: true, docs: "adr" },
  { name: "asyncValidator", summary: "Registers an asynchronous validation rule.", support: "Model-only", note: "Stored, but the current validation path does not execute it." },
  { name: "autocomplete", summary: "Stores a browser autocomplete hint.", support: "Adapter / planned", deprecated: true, docs: "adr" },
  { name: "autofocus", summary: "Requests focus when a control appears.", support: "Adapter / planned", deprecated: true, docs: "adr" },
  { name: "cellClass", summary: "Adds a semantic class to every cell for a field.", support: "Live / implemented", docs: "field-type" },
  { name: "compareFunction", summary: "Defines how two field values are ordered.", support: "Live / implemented", docs: "field-type" },
  { name: "conditionalCellClass", summary: "Adds a cell class when a value predicate passes.", support: "Live / implemented", docs: "field-type" },
  { name: "defaultValue", summary: "Defines the value restored by Record.clear().", support: "Live / implemented", docs: "field-type" },
  { name: "description", summary: "Appends descriptive metadata to a field definition.", support: "Model-only", note: "Available through FieldType.info(); no portfolio renderer consumes it." },
  { name: "disabled", summary: "Makes a field permanently unavailable for editing.", support: "Live / implemented", docs: "field-type" },
  { name: "disabledWhen", summary: "Disables a field while a record predicate is true.", support: "Live / implemented", docs: "field-type" },
  { name: "emptyWhen", summary: "Adds values that count as empty during validation.", support: "Live / implemented", docs: "field-type" },
  { name: "exampleValue", summary: "Supplies values for generated example records.", support: "Live / implemented", docs: "field-type" },
  { name: "field", summary: "Stores a record-field binding alias.", support: "Adapter / planned", deprecated: true, docs: "adr" },
  { name: "filter", summary: "Defines how table filter text matches a value.", support: "Live / implemented", docs: "field-type" },
  { name: "filtering", summary: "Marks an option control as interactively filterable.", support: "Adapter / planned", note: "Needs a richer option-control adapter." },
  { name: "formElement", summary: "Selects a renderer component and its private properties.", support: "Adapter / planned", deprecated: true, docs: "adr" },
  { name: "formatOnChange", summary: "Requests formatting during input events.", support: "Adapter / planned", deprecated: true, docs: "adr" },
  { name: "formatter", summary: "Transforms a stored value for display.", support: "Live / implemented", docs: "field-type" },
  { name: "hasSearch", summary: "Legacy shorthand for search-capable controls.", support: "Adapter / planned", deprecated: true, docs: "adr" },
  { name: "hashFunction", summary: "Defines stable identity for complex option values.", support: "Live / implemented", docs: "field-type" },
  { name: "hideLabel", summary: "Requests a visually hidden field label.", support: "Adapter / planned", deprecated: true, docs: "adr" },
  { name: "iconMessage", summary: "Stores copy for a renderer-owned tooltip.", support: "Adapter / planned", deprecated: true, docs: "adr" },
  { name: "inline", summary: "Requests inline field layout.", support: "Adapter / planned", deprecated: true, docs: "adr" },
  { name: "inlineWhen", summary: "Requests inline layout conditionally.", support: "Adapter / planned", deprecated: true, docs: "adr" },
  { name: "inputMask", summary: "Defines which individual characters a field accepts.", support: "Model-only", note: "The model can test characters; the native adapter does not block typing." },
  { name: "label", summary: "Provides a static or record-derived label.", support: "Live / implemented", docs: "field-type" },
  { name: "list", summary: "Stores a browser datalist identifier.", support: "Adapter / planned", deprecated: true, docs: "adr" },
  { name: "max", summary: "Stores a browser maximum-value hint.", support: "Adapter / planned", deprecated: true, docs: "adr" },
  { name: "maxColumnWidth", summary: "Sets maximum table-column width guidance.", support: "Live / implemented", docs: "field-type" },
  { name: "maxLength", summary: "Caps input length and adds model validation.", support: "Live / implemented", docs: "field-type" },
  { name: "minColumnWidth", summary: "Sets minimum table-column width guidance.", support: "Live / implemented", docs: "field-type" },
  { name: "minLength", summary: "Sets minimum input length and model validation.", support: "Live / implemented", docs: "field-type" },
  { name: "multipleValues", summary: "Models an array with minimum and maximum selection counts.", support: "Model-only", note: "The native adapter currently stores one selected string and does not enforce the bounds." },
  { name: "onValueChange", summary: "Runs imperative reactions after value changes.", support: "Adapter / planned", deprecated: true, docs: "adr" },
  { name: "options", summary: "Supplies static, fetched, or dependency-aware choices.", support: "Live / implemented", docs: "field-type" },
  { name: "parseDynamicRange", summary: "Requests conversion of a dynamic range input.", support: "Adapter / planned", deprecated: true, docs: "adr" },
  { name: "parser", summary: "Transforms display input into a stored value.", support: "Live / implemented", docs: "field-type" },
  { name: "pattern", summary: "Stores a browser pattern constraint.", support: "Adapter / planned", deprecated: true, docs: "adr" },
  { name: "placeholder", summary: "Provides temporary hint text for an empty input.", support: "Live / implemented", docs: "field-type" },
  { name: "range", summary: "Marks a field as holding start and end values.", support: "Model-only", note: "The value contract is stored, but the native adapter has no range control." },
  { name: "readOnly", summary: "Always presents the field as non-editable output.", support: "Live / implemented", docs: "field-type" },
  { name: "readOnlyExceptionWhen", summary: "Exempts part of a composite control from read-only state.", support: "Adapter / planned", deprecated: true, docs: "adr" },
  { name: "readOnlyWhen", summary: "Presents non-editable output while a predicate is true.", support: "Live / implemented", docs: "field-type" },
  { name: "reducer", summary: "Aggregates a field's values, including a built-in sum.", support: "Live / implemented", docs: "field-type" },
  { name: "required", summary: "Requires a non-empty value and adds model validation.", support: "Live / implemented", docs: "field-type" },
  { name: "requiredWhen", summary: "Requires a value conditionally and adds model validation.", support: "Live / implemented", docs: "field-type" },
  { name: "rowClasses", summary: "Computes semantic classes for a table row.", support: "Live / implemented", docs: "field-type" },
  { name: "rowCount", summary: "Sets visible rows for textarea-like controls.", support: "Live / implemented", docs: "field-type" },
  { name: "schema", summary: "Stores legacy field-schema metadata.", support: "Adapter / planned", deprecated: true, docs: "adr" },
  { name: "search", summary: "Describes a rich option-search dialog.", support: "Adapter / planned", note: "The model stores the configuration; the native adapter has no search dialog." },
  { name: "segmented", summary: "Requests segmented-control presentation.", support: "Adapter / planned", deprecated: true, docs: "adr" },
  { name: "selectOnFocus", summary: "Requests selecting a control's text on focus.", support: "Model-only", note: "Stored and forwarded, but the native adapter has no focus handler." },
  { name: "selectionDisabledFunctions", summary: "Defines predicates that disable individual choices.", support: "Model-only", note: "Stored and partly forwarded; native select and date inputs do not enforce it." },
  { name: "sortable", summary: "Enables or disables sorting for a table field.", support: "Live / implemented", docs: "field-type" },
  { name: "step", summary: "Stores a browser numeric-step hint.", support: "Adapter / planned", deprecated: true, docs: "adr" },
  { name: "tag", summary: "Selects the native child control in the current Lit adapter.", support: "Adapter / planned", deprecated: true, note: "Implemented by the current adapter, but deprecated as renderer-specific metadata.", docs: "adr" },
  { name: "targetColumnWidth", summary: "Sets preferred table-column width guidance.", support: "Live / implemented", docs: "field-type" },
  { name: "template", summary: "Transforms formatted data into final printed or table output.", support: "Live / implemented", docs: "field-type" },
  { name: "textAlign", summary: "Stores portable left, center, or right alignment intent.", support: "Live / implemented", docs: "field-type" },
  { name: "toggle", summary: "Requests toggle-switch presentation for a Boolean field.", support: "Adapter / planned", note: "Needs a compatible Boolean-control adapter." },
  { name: "type", summary: "Sets the native input type in the current adapter.", support: "Live / implemented", docs: "field-type" },
  { name: "usesCustomPrint", summary: "Flags renderer-owned custom print behavior.", support: "Adapter / planned", deprecated: true, docs: "adr" },
  { name: "validator", summary: "Adds a named synchronous business rule.", support: "Live / implemented", docs: "field-type" },
  { name: "visibleWhen", summary: "Includes a field only while its predicates pass.", support: "Live / implemented", docs: "field-type" },
];

const repo = "https://github.com/pmcelhaney/FDL/blob/main";
const links = {
  "field-type": `${repo}/docs/field-type.md`,
  "design-principles": `${repo}/docs/design-principles.md`,
  adr: `${repo}/docs/adr/0001-retire-post-jack-henry-modifiers.md`,
};

const groups: Support[] = ["Live / implemented", "Model-only", "Adapter / planned"];

export default function ReferencePage() {
  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <p className={styles.eyebrow}>Reference · current builder surface</p>
        <h1>Modifier support, without the wishful thinking.</h1>
        <p className={styles.lede}>
          FDL has 66 public builder modifiers today. This matrix separates behavior the repository
          demonstrates end to end from metadata that only the model understands and work that
          belongs in a renderer adapter.
        </p>
        <div className={styles.actions}>
          <a className={styles.primary} href="/demo">See the narrative demo</a>
          <a href={`${repo}/examples/fdl-input/fdl-modifier-catalog.ts`}>Inspect catalog evidence</a>
        </div>
      </header>

      <aside className={styles.legend} aria-label="Support status definitions">
        <p><strong>Live / implemented</strong> — exercised by the current model, form, or table example.</p>
        <p><strong>Model-only</strong> — stored or computed in FDL, but not complete through the current UI adapter.</p>
        <p><strong>Adapter / planned</strong> — renderer work, legacy compatibility, or a capability with no current adapter.</p>
      </aside>

      {groups.map((group) => {
        const entries = modifiers.filter((modifier) => modifier.support === group);
        const id = group.toLowerCase().replaceAll(/[^a-z]+/g, "-");
        return (
          <section className={styles.group} aria-labelledby={id} key={group}>
            <div className={styles.groupHeading}>
              <h2 id={id}>{group}</h2>
              <span>{entries.length} modifiers</span>
            </div>
            <div className={styles.tableWrap}>
              <table>
                <thead><tr><th scope="col">Modifier</th><th scope="col">What it declares</th><th scope="col">Evidence / limitation</th></tr></thead>
                <tbody>
                  {entries.map((modifier) => (
                    <tr key={modifier.name}>
                      <th scope="row"><code>{modifier.name}()</code>{modifier.deprecated && <span className={styles.deprecated}>Deprecated</span>}</th>
                      <td>{modifier.summary}</td>
                      <td>{modifier.note ?? (modifier.docs ? <a href={links[modifier.docs]}>Documentation</a> : "Builder evidence only")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        );
      })}

      <footer className={styles.provenance}>
        <h2>How this inventory was classified</h2>
        <p>
          Names come from <a href={`${repo}/field-type-builder.ts`}>FieldTypeBuilder</a> and status is
          cross-checked against the <a href={`${repo}/examples/fdl-input/fdl-modifier-catalog.ts`}>working modifier catalog</a>.
          Deprecation status comes from <a href={links.adr}>ADR-0001</a>. “Planned” means an adapter boundary
          is identified; it is not a delivery promise.
        </p>
      </footer>
    </main>
  );
}
