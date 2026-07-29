import { LitElement, css, html, nothing, type TemplateResult } from 'lit';
import FieldType from '../../field-type.js';
import Record from '../../record.js';
import Recordset from '../../recordset.js';
import './fdl-input';
import './fdl-select';
import './fdl-table';

type DemoName =
    | 'additionalProperties' | 'cellClass' | 'compareFunction' | 'conditionalCellClass'
    | 'defaultValue' | 'description' | 'disabled' | 'disabledWhen' | 'emptyWhen'
    | 'exampleValue' | 'field' | 'filter' | 'formatter' | 'hashFunction' | 'hideLabel'
    | 'inputMask' | 'label' | 'maxColumnWidth' | 'maxLength'
    | 'minColumnWidth' | 'minLength' | 'onValueChange' | 'options'
    | 'placeholder' | 'readOnly' | 'readOnlyWhen' | 'reducer' | 'required'
    | 'requiredWhen' | 'rowClasses' | 'rowCount' | 'sortable' | 'step' | 'tag'
    | 'targetColumnWidth' | 'template' | 'textAlign' | 'type' | 'validator'
    | 'visibleWhen';

type CatalogEntry = {
    name: string;
    intent: string;
    demo?: DemoName;
    limitation?: string;
    snippet?: string;
};

const customControlGap =
    'The modifier configures a richer custom control API. This example only provides native input, select, and textarea controls, which do not implement that contract.';
const legacyGap =
    'This is a deprecated compatibility API and the legacy component/schema registry it expects is not present in this example.';

const live = (name: string, intent: string, demo: DemoName, snippet?: string): CatalogEntry => ({
    name, intent, demo, snippet,
});
const placeholder = (name: string, intent: string, limitation: string): CatalogEntry => ({
    name, intent, limitation,
});

const entries: CatalogEntry[] = [
    placeholder('accept', 'Restricts the file types offered by a file input.', 'The native attribute is wired, but choosing a file exposes a current adapter bug: FormElement writes the browser’s file-path string back to input[type=file], which browsers reject. A live picker would therefore be misleading.'),
    live('additionalProperties', 'Assigns extra properties directly to the rendered control.', 'additionalProperties', `.additionalProperties({ title: 'Used by the finance team' })`),
    placeholder('asyncValidator', 'Registers a validation rule intended to run asynchronously.', 'The builder stores async validators, but current FieldType.validate() and Record validation do not execute that collection. There is no completion or error path to demonstrate yet.'),
    placeholder('autocomplete', 'Sets the browser autocomplete token for a control.', 'The attribute is wired, but a functional demonstration depends on browser profile data and autofill policy. The example cannot produce a deterministic, privacy-safe result.'),
    placeholder('autofocus', 'Requests focus when the control is first connected.', 'Autofocusing one card in a long reference page would unexpectedly steal focus and scroll position. A reliable example needs an isolated route or dialog lifecycle.'),
    live('cellClass', 'Adds a CSS class to every table cell for this field.', 'cellClass', `.cellClass('numeric-cell')`),
    live('compareFunction', 'Defines how two field values are ordered.', 'compareFunction', `const people = new Recordset({
  firstName: new FieldType().with
    .label('First name')
    .and.compareFunction((a, b) => a.localeCompare(b)),
  lastName: new FieldType().with
    .label('Last name')
    .and.compareFunction((a, b) => a.localeCompare(b)),
}, data);

<fdl-table .recordset=\${people}>
  <fdl-column field="firstName" sortable="true"></fdl-column>
  <fdl-column field="lastName" sortable="true"></fdl-column>
  <fdl-column field="team"></fdl-column>
</fdl-table>`),
    live('conditionalCellClass', 'Adds a table-cell class when a value predicate passes.', 'conditionalCellClass', `.conditionalCellClass(value => value > 10000, 'high-value')`),
    live('defaultValue', 'Defines the value Record.clear() restores for this field.', 'defaultValue', `.defaultValue('Pending assignment')`),
    live('description', 'Adds human-readable information to FieldType introspection metadata.', 'description', `.description('Internal finance reference')`),
    live('disabled', 'Makes a control visible but permanently unavailable for editing.', 'disabled', `.disabled()`),
    live('disabledWhen', 'Disables a control only while a record predicate is true.', 'disabledWhen', `.disabledWhen(record => record.getField('status') === 'approved')`),
    live('emptyWhen', 'Defines additional values that should count as empty during validation.', 'emptyWhen', `.emptyWhen(value => value === 'N/A')`),
    live('exampleValue', 'Supplies fixed or index-derived values for generated example records.', 'exampleValue', `.exampleValue(index => \`Sample contact \${index + 1}\`)`),
    live('field', 'Associates an alternate source-field name with the field type.', 'field', `.field('owner_id')`),
    live('filter', 'Defines how a search term matches a candidate value.', 'filter', `.filter((text, value) => value.toLowerCase().startsWith(text.toLowerCase()))`),
    placeholder('filtering', 'Marks an option control as supporting interactive filtering.', customControlGap),
    placeholder('formatOnChange', 'Requests that a control apply its formatter while the value changes.', 'FormElement forwards this as an expando property, but native controls do not read it and the adapter writes raw values directly to the record.'),
    live('formatter', 'Transforms a stored value for display without changing the model value.', 'formatter', `.formatter(value => currency.format(Number(value)))`),
    placeholder('formElement', 'Selects a legacy custom form element and passes it properties.', legacyGap),
    live('hashFunction', 'Defines stable identity for complex option values.', 'hashFunction', `.hashFunction(employee => employee.id)`),
    placeholder('hasSearch', 'Enables search affordances without supplying a full search configuration.', customControlGap),
    live('hideLabel', 'Keeps a configured label for metadata while hiding its visual rendering.', 'hideLabel', `.label('Search').and.hideLabel()`),
    placeholder('iconMessage', 'Supplies informational tooltip text for a field.', 'FieldType exposes the message, but FormElement never renders an icon or tooltip. A live example needs a design-system control that consumes it.'),
    placeholder('inline', 'Marks a compatible control as using an inline layout.', customControlGap),
    placeholder('inlineWhen', 'Enables inline layout only while a record predicate is true.', customControlGap),
    live('inputMask', 'Defines which individual typed characters a field accepts.', 'inputMask', `.inputMask(/[0-9.]/)`),
    live('label', 'Provides a static label or derives one from the current record.', 'label', `.label(record => \`Amount for \${record.getField('expenseType')}\`)`),
    placeholder('list', 'Connects a native input to a datalist of suggested values.', 'FormElement applies the list attribute, but it creates the native input inside its own shadow root while the catalog datalist lives outside that root. Native datalist lookup cannot cross that boundary, and the wrapper has no API for supplying one internally.'),
    placeholder('max', 'Sets the native maximum constraint for a numeric or date input.', 'FormElement forwards the attribute, but this catalog has no native form-validation bridge to surface rangeOverflow or checkValidity(). Values above the maximum remain editable, so a live card claiming they are rejected would be misleading.'),
    live('maxColumnWidth', 'Sets the maximum width requested for a table column.', 'maxColumnWidth', `.maxColumnWidth(180)`),
    live('maxLength', 'Caps input length and adds equivalent record validation.', 'maxLength', `.maxLength(12)`),
    live('minColumnWidth', 'Sets the minimum width requested for a table column.', 'minColumnWidth', `.minColumnWidth(110)`),
    live('minLength', 'Sets a minimum input length and adds equivalent record validation.', 'minLength', `.minLength(4)`),
    placeholder('multipleValues', 'Models a field as an array with minimum and maximum selection counts.', 'FormElement sets the native multiple property but reads only event.target.value, so it stores one string instead of the selected array and does not enforce the count bounds.'),
    live('onValueChange', 'Runs a record-level reaction after this field commits a changed value.', 'onValueChange', `.onValueChange(record => record.setField('total', Number(record.getField('quantity')) * 25))`),
    live('options', 'Supplies static or fetched choices and can refresh them from dependency fields.', 'options', `.options({ fields: ['department'], fetch: record => directory[record.getField('department')] })`),
    placeholder('parseDynamicRange', 'Requests parsing for expressions such as relative or dynamic date ranges.', 'The flag is forwarded for a custom date-range control, but this example has no date-range parser or control to consume it.'),
    placeholder('parser', 'Transforms an incoming display value into the stored model representation.', 'FieldType.parse() and Record.parseAndSetField() can invoke the parser, but FormElement commits native input with record.setField() and bypasses it. A standalone computed call would not demonstrate the actual form path.'),
    placeholder('pattern', 'Sets a native input validation pattern.', 'The builder accepts RegExp, while HTMLInputElement.pattern expects the expression source as a string. The current adapter coerces the RegExp with slash delimiters, so a live validation claim would be inaccurate.'),
    live('placeholder', 'Shows temporary hint text while an input is empty.', 'placeholder', `.placeholder('For example, Apollo migration')`),
    placeholder('range', 'Marks a field as representing a start/end range rather than one value.', 'FieldType stores the flag, but FormElement neither chooses nor implements a range control. The intended value and event contract are not clear in this native example.'),
    live('readOnly', 'Always renders the field as a printed, non-editable value.', 'readOnly', `.readOnly()`),
    placeholder('readOnlyExceptionWhen', 'Exempts part of a compatible composite control from another read-only rule.', 'The exception flag is forwarded, but native controls have no composite subparts or exception contract. Its behavior only makes sense in the absent custom control.'),
    live('readOnlyWhen', 'Switches a field to printed, non-editable output while a predicate is true.', 'readOnlyWhen', `.readOnlyWhen(record => record.getField('phase') === 'submitted')`),
    live('reducer', 'Aggregates a column’s values, with sum available as a built-in reducer.', 'reducer', `.reducer('sum')`),
    live('required', 'Always requires a non-empty value and adds record validation.', 'required', `.required()`),
    live('requiredWhen', 'Requires a value only while a record predicate is true.', 'requiredWhen', `.requiredWhen(record => record.getField('followUp') === 'yes')`),
    live('rowClasses', 'Computes CSS classes for the table row containing a value.', 'rowClasses', `.rowClasses(value => value === 'Disputed' ? ['disputed-row'] : [])`),
    live('rowCount', 'Sets the visible row count of textarea-like controls.', 'rowCount', `.tag('textarea').and.rowCount(4)`),
    placeholder('schema', 'Associates a deprecated legacy schema identifier with the field.', 'The value is retained as deprecated metadata, but the native FormElement adapter does not select a control from it. The remaining range/datepicker special cases do not define a clear standalone form contract.'),
    placeholder('search', 'Enables a rich option-search dialog and describes its result columns.', customControlGap),
    placeholder('segmented', 'Requests segmented-choice presentation from a compatible control.', customControlGap),
    placeholder('selectionDisabledFunctions', 'Supplies predicates that disable individual choices, such as dates.', 'FormElement only forwards the date predicate as an expando property. Native select and date inputs do not use it to disable individual choices.'),
    placeholder('selectOnFocus', 'Requests selecting all text when a compatible control receives focus.', 'The flag is forwarded as an expando property, but FormElement does not attach a focus handler and native inputs do not interpret that property.'),
    live('sortable', 'Enables or disables sorting for a table column.', 'sortable', `.sortable(false)`),
    live('step', 'Sets the increment used by numeric or date inputs.', 'step', `.type('number').and.step(0.25)`),
    live('tag', 'Chooses the native or custom tag created for the form control.', 'tag', `.tag('textarea')`),
    live('targetColumnWidth', 'Sets the preferred width requested for a table column.', 'targetColumnWidth', `.targetColumnWidth(140)`),
    live('template', 'Transforms a formatted value into its final printed or table representation.', 'template', `.template(value => \`Invoice #\${value}\`)`),
    live('textAlign', 'Stores the preferred left or right alignment for rendered values.', 'textAlign', `.textAlign('right')`),
    placeholder('toggle', 'Requests toggle-switch presentation from a compatible Boolean control.', customControlGap),
    live('type', 'Sets the native input type, such as email, number, or date.', 'type', `.type('date')`),
    placeholder('usesCustomPrint', 'Keeps a custom control mounted when a field becomes read-only so the control can own printed rendering.', 'The native controls do not implement custom print rendering. Enabling it here would merely leave a read-only input mounted and would not show the intended contract.'),
    live('validator', 'Adds a named synchronous business rule to record validation.', 'validator', `.validator({ name: 'must look like PRJ-1234', validate: value => /^PRJ-\\d{4}$/.test(value) })`),
    live('visibleWhen', 'Includes the field only while every visibility predicate is true.', 'visibleWhen', `.visibleWhen(record => record.getField('fulfillment') === 'ship')`),
].sort((left, right) => left.name.localeCompare(right.name));

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export class FdlModifierCatalog extends LitElement {
    private messages: { [field: string]: string } = {};

    private defaultRecord = new Record(
        { defaultId: new FieldType().with.label('Request ID').and.defaultValue('Pending assignment') },
        { defaultId: 'REQ-1042' }
    );

    private record = new Record(
        {
            extraProperty: new FieldType().with.label('Hover for the native title').and.additionalProperties({ title: 'Used by the finance team' }),
            lockedId: new FieldType().with.label('System ID').and.disabled(),
            approvalStatus: new FieldType().with.tag('select').and.label('Approval status').and.options([{ text: 'Draft', value: 'draft' }, { text: 'Approved', value: 'approved' }]),
            budget: new FieldType().with.label('Budget').and.type('number').and.disabledWhen(record => record.getField('approvalStatus') === 'approved'),
            emptyCode: new FieldType().with.label('Reference').and.required().and.emptyWhen(value => value === 'N/A'),
            hiddenSearch: new FieldType().with.label('Search directory').and.hideLabel().and.placeholder('Search directory').and.additionalProperties({ ariaLabel: 'Search directory' }),
            expenseType: new FieldType().with.tag('select').and.label('Expense type').and.options([{ text: 'Travel', value: 'travel' }, { text: 'Equipment', value: 'equipment' }]),
            dynamicAmount: new FieldType<any>().with.label((record: any) => `Amount for ${record.getField('expenseType')}`).and.type('number'),
            shortCode: new FieldType().with.label('Short code').and.maxLength(12),
            longCode: new FieldType().with.label('Access code').and.minLength(4),
            quantity: new FieldType<any>().with.tag('select').and.label('Quantity').and.options([{ text: '1', value: 1 }, { text: '2', value: 2 }, { text: '4', value: 4 }]).and.onValueChange((record: any) => record.setField('total', Number(record.getField('quantity')) * 25)),
            total: new FieldType().with.label('Total at $25 each').and.formatter(value => currency.format(Number(value))).and.readOnly(),
            department: new FieldType().with.tag('select').and.label('Department').and.options([{ text: 'Engineering', value: 'engineering' }, { text: 'Finance', value: 'finance' }]),
            assignee: new FieldType<any>().with.tag('select').and.label('Assignee').and.options({ fields: ['department'], fetch: (record: any) => Promise.resolve(record.getField('department') === 'finance' ? [{ text: 'Katherine Johnson', value: 'katherine' }, { text: 'Mary Jackson', value: 'mary' }] : [{ text: 'Grace Hopper', value: 'grace' }, { text: 'Margaret Hamilton', value: 'margaret' }]) }),
            projectName: new FieldType().with.label('Project name').and.placeholder('For example, Apollo migration'),
            fixedOwner: new FieldType().with.label('Owner').and.readOnly(),
            phase: new FieldType().with.tag('select').and.label('Phase').and.options([{ text: 'Draft', value: 'draft' }, { text: 'Submitted', value: 'submitted' }]),
            conditionalOwner: new FieldType().with.label('Request owner').and.readOnlyWhen(record => record.getField('phase') === 'submitted'),
            requiredName: new FieldType().with.label('Legal name').and.required(),
            followUp: new FieldType().with.tag('select').and.label('Follow-up needed?').and.options([{ text: 'No', value: 'no' }, { text: 'Yes', value: 'yes' }]),
            followUpNotes: new FieldType().with.tag('textarea').and.label('Follow-up notes').and.rowCount(2).and.requiredWhen(record => record.getField('followUp') === 'yes'),
            comments: new FieldType().with.tag('textarea').and.label('Comments').and.rowCount(4),
            increment: new FieldType().with.label('Increment').and.type('number').and.step(0.25),
            textareaTag: new FieldType().with.tag('textarea').and.label('Control created by tag()').and.rowCount(2),
            dateType: new FieldType().with.label('Start date').and.type('date'),
            projectCode: new FieldType().with.label('Project code').and.validator({ name: 'must look like PRJ-1234', validate: value => /^PRJ-\d{4}$/.test(String(value)) }),
            fulfillment: new FieldType().with.tag('select').and.label('Fulfillment').and.options([{ text: 'Ship', value: 'ship' }, { text: 'Pickup', value: 'pickup' }]),
            address: new FieldType().with.label('Shipping address').and.visibleWhen(record => record.getField('fulfillment') === 'ship'),
        },
        {
            extraProperty: '', lockedId: 'SYS-77', approvalStatus: 'draft', budget: 5000,
            emptyCode: 'N/A', hiddenSearch: '', expenseType: 'travel', dynamicAmount: '',
            shortCode: '', longCode: '', quantity: 2, total: 50, department: 'engineering', assignee: 'grace',
            projectName: '', fixedOwner: 'Ada Lovelace', phase: 'draft', conditionalOwner: 'Ada Lovelace', requiredName: '',
            followUp: 'no', followUpNotes: '', comments: '', increment: 1, textareaTag: '', dateType: '', projectCode: '',
            fulfillment: 'ship', address: '',
        }
    );

    private formatType = new FieldType().with.formatter(value => currency.format(Number(value)));
    private templateType = new FieldType().with.template(value => `Invoice #${value}`);
    private descriptionType = new FieldType().with.description('Internal finance reference');
    private exampleType = new FieldType<string>().with.exampleValue(index => `Sample contact ${index + 1}`);
    private fieldType = new FieldType().with.field('owner_id');
    private filterType = new FieldType().with.filter(((text: string, value: string) => value.toLowerCase().startsWith(text.toLowerCase())) as any);
    private hashType = new FieldType().with.hashFunction((employee: { id: string }) => employee.id);
    private maskType = new FieldType().with.inputMask(/[0-9.]/);
    private cellClassType = new FieldType().with.cellClass('numeric-cell');
    private conditionalClassType = new FieldType().with.conditionalCellClass((value: number) => value > 10000, 'high-value');
    private compareRecordset = new Recordset(
        {
            firstName: new FieldType().with
                .label('First name')
                .and.compareFunction((left: string, right: string) => left.localeCompare(right) as -1 | 0 | 1),
            lastName: new FieldType().with
                .label('Last name')
                .and.compareFunction((left: string, right: string) => left.localeCompare(right) as -1 | 0 | 1),
            team: new FieldType().with.label('Team'),
        },
        [
            { firstName: 'Ada', lastName: 'Zulu', team: 'Research' },
            { firstName: 'Grace', lastName: 'Alpha', team: 'Platform' },
            { firstName: 'Ada', lastName: 'Mike', team: 'Platform' },
            { firstName: 'Grace', lastName: 'Beta', team: 'Research' },
        ]
    );
    private reducerType = new FieldType().with.reducer('sum');
    private rowClassType = new FieldType().with.rowClasses((value: string) => value === 'Disputed' ? ['disputed-row'] : []);
    private widthTypes = {
        maxColumnWidth: new FieldType().with.maxColumnWidth(180),
        minColumnWidth: new FieldType().with.minColumnWidth(110),
        targetColumnWidth: new FieldType().with.targetColumnWidth(140),
    };
    private sortableType = new FieldType().with.sortable(false);
    private alignType = new FieldType().with.textAlign('right');

    connectedCallback() {
        super.connectedCallback();
        this.record.addEventListener('change', this.onRecordChange);
        this.defaultRecord.addEventListener('change', this.onRecordChange);
    }

    disconnectedCallback() {
        this.record.removeEventListener('change', this.onRecordChange);
        this.defaultRecord.removeEventListener('change', this.onRecordChange);
        super.disconnectedCallback();
    }

    private onRecordChange = () => this.requestUpdate();

    private clearDefaultRecord = () => {
        this.defaultRecord.clear();
        this.requestUpdate();
    };

    private renderField(field: string, record: Record<any> = this.record) {
        const fieldType = record.fieldTypeForField(field);
        return fieldType.tag() === 'select'
            ? html`<fdl-select field=${field} .record=${record}></fdl-select>`
            : html`<fdl-input field=${field} .record=${record}></fdl-input>`;
    }

    private setMessage(field: string) {
        this.messages = {
            ...this.messages,
            [field]: this.record.isValid(field) ? 'Valid.' : this.record.readableFieldErrors(field).join('; '),
        };
        this.requestUpdate();
    }

    private message(field: string) {
        return this.messages[field] ? html`<p class="result" role="status">${this.messages[field]}</p>` : nothing;
    }

    private renderValidation(field: string) {
        return html`${this.renderField(field)}<button type="button" @click=${() => this.setMessage(field)}>Check value</button>${this.message(field)}`;
    }

    private renderWidth(name: 'maxColumnWidth' | 'minColumnWidth' | 'targetColumnWidth') {
        const value = (this.widthTypes[name] as any).properties[name];
        return html`<div class="width-demo" style=${`width:${value}px`}>${value}px ${name.replace('ColumnWidth', '')}</div>`;
    }

    private renderDemo(name: DemoName): TemplateResult {
        switch (name) {
            case 'additionalProperties': return html`<p class="try">Hover the input to see the extra native <code>title</code> property.</p>${this.renderField('extraProperty')}`;
            case 'cellClass': return html`<table><caption>Applied cell class</caption><tbody><tr><td class=${this.cellClassType.cellClasses(42).join(' ')}>42 has class “numeric-cell”</td></tr></tbody></table>`;
            case 'compareFunction': {
                return html`<p class="try">Click First name and Last name. Numbered arrows show the primary and secondary sort.</p>
                    <fdl-table .recordset=${this.compareRecordset}>
                        <fdl-column field="firstName" sortable="true"></fdl-column>
                        <fdl-column field="lastName" sortable="true"></fdl-column>
                        <fdl-column field="team"></fdl-column>
                    </fdl-table>`;
            }
            case 'conditionalCellClass': return html`<table><caption>Conditional class</caption><tbody><tr><td class=${this.conditionalClassType.cellClasses(12000).join(' ')}>$12,000 receives “high-value”</td></tr><tr><td class=${this.conditionalClassType.cellClasses(2000).join(' ')}>$2,000 does not</td></tr></tbody></table>`;
            case 'defaultValue': return html`${this.renderField('defaultId', this.defaultRecord)}<button type="button" @click=${this.clearDefaultRecord}>Clear the record</button><p class="computed">Current record value: ${this.defaultRecord.getField('defaultId')}</p>`;
            case 'description': return html`<p class="computed">FieldType.info(): ${this.descriptionType.info()}</p>`;
            case 'disabled': return html`${this.renderField('lockedId')}`;
            case 'disabledWhen': return html`<p class="try">Choose Approved to disable Budget.</p>${this.renderField('approvalStatus')}${this.renderField('budget')}`;
            case 'emptyWhen': return html`<p class="try">“N/A” is configured to count as empty.</p>${this.renderValidation('emptyCode')}`;
            case 'exampleValue': return html`<p class="computed">Generated values: ${[0, 1, 2].map(index => this.exampleType.exampleValue()(index)).join(', ')}</p>`;
            case 'field': return html`<p class="computed">Mapped source field: <code>${this.fieldType.field()}</code></p>`;
            case 'filter': return html`<p class="computed">Search “gr” matches Grace: ${String(this.filterType.match('gr', 'Grace'))}; matches Ada: ${String(this.filterType.match('gr', 'Ada'))}</p>`;
            case 'formatter': return html`<p class="computed">Stored value: 1250 · Printed value: ${this.formatType.print(1250, undefined as any)}</p>`;
            case 'hashFunction': return html`<p class="computed">Two separate employee objects hash to “${this.hashType.hashFunction()({ id: 'ada' })}” and “${this.hashType.hashFunction()({ id: 'ada' })}”, so a consumer can match their identity.</p>`;
            case 'hideLabel': return html`<p class="try">The visual label is hidden; the input keeps an accessible name and placeholder.</p>${this.renderField('hiddenSearch')}`;
            case 'inputMask': return html`<p class="computed">Allowed: “7” ${String(this.maskType.allowInputChar('7'))}, “.” ${String(this.maskType.allowInputChar('.'))}; blocked: “A” ${String(this.maskType.allowInputChar('A'))}. The native adapter does not enforce this during typing.</p>`;
            case 'label': return html`<p class="try">Change the expense type and watch the amount label.</p>${this.renderField('expenseType')}${this.renderField('dynamicAmount')}`;
            case 'maxColumnWidth': return this.renderWidth('maxColumnWidth');
            case 'maxLength': return this.renderValidation('shortCode');
            case 'minColumnWidth': return this.renderWidth('minColumnWidth');
            case 'minLength': return this.renderValidation('longCode');
            case 'onValueChange': return html`<p class="try">Choose a quantity; Total updates at $25 each.</p>${this.renderField('quantity')}${this.renderField('total')}`;
            case 'options': return html`<p class="try">Change Department; Assignee choices refresh.</p>${this.renderField('department')}${this.renderField('assignee')}`;
            case 'placeholder': return html`${this.renderField('projectName')}`;
            case 'readOnly': return html`${this.renderField('fixedOwner')}`;
            case 'readOnlyWhen': return html`<p class="try">Choose Submitted to replace the owner input with printed text.</p>${this.renderField('phase')}${this.renderField('conditionalOwner')}`;
            case 'reducer': return html`<p class="computed">aggregate([1200, 800, 500]) → ${currency.format(this.reducerType.aggregate([1200, 800, 500]))}</p>`;
            case 'required': return this.renderValidation('requiredName');
            case 'requiredWhen': return html`<p class="try">Choose Yes, then check the empty notes.</p>${this.renderField('followUp')}${this.renderValidation('followUpNotes')}`;
            case 'rowClasses': return html`<table><caption>Computed row classes</caption><tbody><tr class=${this.rowClassType.rowClasses('Disputed', undefined as any).join(' ')}><td>Disputed receives “disputed-row”</td></tr><tr class=${this.rowClassType.rowClasses('Paid', undefined as any).join(' ')}><td>Paid does not</td></tr></tbody></table>`;
            case 'rowCount': return html`${this.renderField('comments')}`;
            case 'sortable': return html`<p class="computed">Sortable metadata: ${String((this.sortableType as any).properties.sortable)}. The disabled sort button represents the consuming table.</p><button type="button" disabled>Sort column</button>`;
            case 'step': return html`${this.renderField('increment')}<p class="computed">Use the spinner: it advances by 0.25.</p>`;
            case 'tag': return html`${this.renderField('textareaTag')}`;
            case 'targetColumnWidth': return this.renderWidth('targetColumnWidth');
            case 'template': return html`<p class="computed">print('1048') → ${this.templateType.print('1048', undefined as any)}</p>`;
            case 'textAlign': return html`<p class="aligned" style=${`text-align:${this.alignType.textAlign()}`}>This value uses textAlign(): right.</p>`;
            case 'type': return html`${this.renderField('dateType')}`;
            case 'validator': return this.renderValidation('projectCode');
            case 'visibleWhen': return html`<p class="try">Choose Pickup to remove Shipping address.</p>${this.renderField('fulfillment')}${this.renderField('address')}`;
        }
    }

    private renderEntry(entry: CatalogEntry) {
        const id = `modifier-${entry.name.toLowerCase()}`;
        const status = entry.demo ? 'live' : 'placeholder';
        return html`<article class="cookbook-recipe" data-modifier=${entry.name} data-status=${status} aria-labelledby=${id}>
            <div class="entry-heading">
                <code class="modifier-name">${entry.name}()</code>
                <span class="status ${status}">${status === 'live' ? 'Live example' : 'Placeholder'}</span>
            </div>
            <h3 id=${id}>${entry.intent}</h3>
            ${entry.demo
                ? html`<div class="demo">${this.renderDemo(entry.demo)}</div>${entry.snippet ? html`<details><summary>View the focused definition</summary><pre><code>${entry.snippet}</code></pre></details>` : nothing}`
                : html`<div class="placeholder-body"><p><strong>Intent:</strong> ${entry.intent}</p><p><strong>Why there is no live example:</strong> ${entry.limitation}</p></div>`}
        </article>`;
    }

    render() {
        return html`<section aria-labelledby="modifier-catalog-heading">
            <p class="eyebrow">Modifier cookbook</p>
            <h2 id="modifier-catalog-heading">Every modifier, alphabetically.</h2>
            <p class="lede">Each entry isolates one modifier. Live examples exercise behavior this repository can demonstrate honestly; placeholders document the intended contract and the missing path for everything else.</p>
            <p class="summary"><strong>${entries.filter(entry => entry.demo).length} live or computed examples</strong> · ${entries.filter(entry => !entry.demo).length} documented placeholders · ${entries.length} modifiers total</p>
            <div class="catalog">${entries.map(entry => this.renderEntry(entry))}</div>
        </section>`;
    }

    static styles = css`
        :host { display: block; color: #172033; font-family: Inter, ui-sans-serif, system-ui, sans-serif; }
        * { box-sizing: border-box; }
        h2, h3, p { margin-top: 0; }
        h2 { color: #111a31; font-family: Georgia, serif; font-size: clamp(2rem, 4vw, 3rem); font-weight: 500; letter-spacing: -.035em; margin-bottom: .6rem; }
        h3 { color: #111a31; font-family: Georgia, serif; font-size: 1.2rem; font-weight: 500; margin: .65rem 0 1rem; }
        .eyebrow { margin-bottom: .6rem; color: #5b52d6; font-size: .75rem; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; }
        .lede { max-width: 50rem; color: #586174; font-size: 1.05rem; line-height: 1.65; }
        .summary { color: #586174; font-size: .9rem; margin-bottom: 2rem; }
        .catalog { display: grid; gap: 1rem; }
        .cookbook-recipe { border: 1px solid #dfe3ee; border-radius: 1rem; background: #fff; box-shadow: 0 8px 24px rgba(34,45,78,.04); padding: 1.25rem; }
        .entry-heading { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
        .modifier-name { border-radius: 100px; background: #eeecff; color: #4438c7; font-size: .8rem; font-weight: 800; padding: .35rem .6rem; }
        .status { border-radius: 100px; font-size: .7rem; font-weight: 800; letter-spacing: .06em; padding: .3rem .55rem; text-transform: uppercase; }
        .status.live { background: #e8f7ef; color: #067647; } .status.placeholder { background: #f1f3f7; color: #586174; }
        .demo, .placeholder-body { border-radius: .75rem; background: #f7f8fc; padding: 1rem; }
        .placeholder-body { border-left: 4px solid #a7adbb; color: #4d5668; line-height: 1.55; }
        .placeholder-body p:last-child { margin-bottom: 0; }
        .try, .computed { color: #586174; font-size: .88rem; line-height: 1.55; }
        fdl-input, fdl-select { display: block; margin-bottom: .7rem; }
        button { border: 0; border-radius: .5rem; background: #4438c7; color: white; cursor: pointer; font: inherit; font-weight: 700; padding: .65rem .9rem; }
        button:disabled { background: #aeb4c2; cursor: not-allowed; }
        .result { color: #9b2c20; font-size: .85rem; font-weight: 700; margin: .7rem 0 0; }
        details { margin-top: .8rem; border: 1px solid #dfe3ee; border-radius: .65rem; background: #101629; color: #d8def0; }
        summary { cursor: pointer; font-size: .8rem; font-weight: 700; padding: .7rem .85rem; }
        pre { overflow-x: auto; border-top: 1px solid #29314a; margin: 0; padding: .85rem; }
        pre code { color: #d8def0; font-size: .76rem; white-space: pre-wrap; }
        table { width: 100%; border-collapse: collapse; } caption { color: #586174; font-size: .78rem; margin-bottom: .4rem; text-align: left; }
        td { border-bottom: 1px solid #dfe3ee; padding: .65rem; } .numeric-cell { font-variant-numeric: tabular-nums; text-align: right; }
        .high-value { background: #fff2d8; color: #8a4b00; font-weight: 800; } .disputed-row { background: #fff8e8; }
        .width-demo { max-width: 100%; border: 2px dashed #766de0; border-radius: .4rem; color: #4438c7; padding: .55rem; }
        .aligned { border: 1px solid #dfe3ee; padding: .65rem; } code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
        @media (min-width: 58rem) { .catalog { grid-template-columns: repeat(2, minmax(0, 1fr)); align-items: start; } }
    `;
}

customElements.define('fdl-modifier-catalog', FdlModifierCatalog);
