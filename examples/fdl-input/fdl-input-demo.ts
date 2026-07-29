import { LitElement, css, html, nothing } from 'lit';
import FieldType from '../../field-type.js';
import Record from '../../record.js';
import './fdl-input';
import './fdl-select';

const currency = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
});

const modifierGroups = [
    ['Input attributes', 'tag(), type(), accept(), autocomplete(), autofocus(), list(), max(), pattern(), step(), placeholder()'],
    ['Labels and guidance', 'label(), hideLabel(), iconMessage(), description()'],
    ['State and layout', 'defaultValue(), disabled(), disabledWhen(), readOnly(), readOnlyWhen(), readOnlyExceptionWhen(), visibleWhen(), inline(), inlineWhen(), segmented(), rowCount(), textAlign(), toggle(), selectOnFocus()'],
    ['Value and validation', 'formatter(), parser(), formatOnChange(), inputMask(), validator(), asyncValidator(), required(), requiredWhen(), minLength(), maxLength(), emptyWhen()'],
    ['Choices and lookups', 'options(), multipleValues(), filter(), filtering(), search(), hasSearch(), selectionDisabledFunctions(), hashFunction()'],
    ['Dates and reactions', 'range(), parseDynamicRange(), onValueChange(), field(), additionalProperties()'],
    ['Tables', 'template(), cellClass(), conditionalCellClass(), rowClasses(), usesCustomPrint(), compareFunction(), sortable(), reducer(), minColumnWidth(), targetColumnWidth(), maxColumnWidth()'],
    ['Examples and compatibility', 'exampleValue(), schema(), formElement()'],
];

const modifierExamples = [
    {
        title: 'Configure native inputs for an asset intake form',
        source: `const assetIntake = {
  assetTag: new FieldType().with
    .label('Asset tag')
    .and.type('text')
    .and.autocomplete('off')
    .and.autofocus()
    .and.list('known-asset-tags')
    .and.pattern(/[A-Z]{3}-\\d{4}/)
    .and.placeholder('LAP-0421'),
  replacementCost: new FieldType().with
    .label('Replacement cost')
    .and.type('number')
    .and.max(25000)
    .and.step(0.01),
  receipt: new FieldType().with
    .label('Receipt image')
    .and.tag('input')
    .and.type('file')
    .and.accept('image/png,image/jpeg'),
};`,
    },
    {
        title: 'Give a finance request clear labels and guidance',
        source: `const reimbursement = {
  amount: new FieldType().with
    .label(record => \`Amount for \${record.getField('expenseType')}\`)
    .and.iconMessage('Enter the amount before tax.')
    .and.description('Attach a receipt for expenses over $25.'),
  receiptReference: new FieldType().with
    .label('Receipt reference')
    .and.hideLabel()
    .and.placeholder('Optional receipt number'),
};`,
    },
    {
        title: 'Adapt a purchase request to its approval state',
        source: `const purchaseRequest = {
  requestId: new FieldType().with
    .label('Request ID')
    .and.defaultValue('Assigned after submission')
    .and.readOnly(),
  vendor: new FieldType().with
    .label('Vendor')
    .and.disabledWhen(record => record.getField('status') === 'approved'),
  submittedBy: new FieldType().with
    .label('Submitted by')
    .and.disabled(),
  negotiatedRate: new FieldType().with
    .label('Negotiated rate')
    .and.readOnlyWhen(record => record.getField('status') === 'approved')
    .and.readOnlyExceptionWhen(record => record.getField('role') === 'procurement'),
  deliveryAddress: new FieldType().with
    .label('Delivery address')
    .and.visibleWhen(record => record.getField('deliveryMethod') === 'ship'),
  subtotal: new FieldType().with
    .label('Subtotal')
    .and.inline()
    .and.textAlign('right'),
  discount: new FieldType().with
    .label('Discount')
    .and.inlineWhen(record => record.getField('hasDiscount')),
  paymentTerms: new FieldType().with
    .label('Payment terms')
    .and.segmented(),
  expedited: new FieldType().with
    .label('Expedited delivery')
    .and.toggle(),
  approverComment: new FieldType().with
    .label('Approver comment')
    .and.selectOnFocus()
    .and.rowCount(4),
};`,
    },
    {
        title: 'Validate and transform an invoice amount',
        source: `const invoiceAmount = new FieldType().with
  .label('Invoice amount')
  .and.formatter(value => currency.format(Number(value)))
  .and.parser(value => String(value).replace(/[$,]/g, ''))
  .and.formatOnChange()
  .and.inputMask(/[0-9$.,]/)
  .and.validator({
    name: 'must be positive',
    validate: value => Number(value) > 0,
  })
  .and.asyncValidator({
    name: 'within approval limit',
    validate: value => Number(value) <= 10000,
  })
  .and.required()
  .and.requiredWhen(record => record.getField('expenseType') === 'capital')
  .and.minLength(1)
  .and.maxLength(12)
  .and.emptyWhen(value => value === 'Not applicable');`,
    },
    {
        title: 'Choose project staff from a searchable directory',
        source: `const projectTeam = {
  members: new FieldType().with
    .label('Project team')
    .and.options({
      fetch: () => directoryService.activeEmployees(),
      text: employee => employee.name,
      value: employee => employee.id,
      fields: ['departmentId'],
    })
    .and.multipleValues(2, 8)
    .and.filter((searchText, employee) =>
      employee.name.toLowerCase().includes(searchText.toLowerCase())
    )
    .and.filtering()
    .and.search({
      title: 'Find an employee',
      columns: [{ label: 'Name', field: 'name' }],
    })
    .and.hasSearch()
    .and.selectionDisabledFunctions({
      contractor: employee => employee.isContractor,
    })
    .and.hashFunction(employee => employee.id),
};`,
    },
    {
        title: 'Coordinate a reporting period and dependent fields',
        source: `const reportFilters = {
  reportingPeriod: new FieldType().with
    .label('Reporting period')
    .and.range()
    .and.parseDynamicRange()
    .and.onValueChange(record => record.setField('page', 1)),
  ownerId: new FieldType().with
    .field('owner_id'),
  region: new FieldType().with
    .label('Region')
    .and.additionalProperties({ 'data-analytics-filter': 'region' }),
};`,
    },
    {
        title: 'Define table behavior for the accounts-receivable report',
        source: `const receivables = {
  invoiceNumber: new FieldType().with
    .template(value => \`Invoice #\${value}\`)
    .and.usesCustomPrint()
    .and.sortable(false),
  balance: new FieldType().with
    .formatter(value => currency.format(Number(value)))
    .and.cellClass('numeric')
    .and.conditionalCellClass(value => value < 0, 'credit')
    .and.rowClasses((value, record) =>
      record.getField('isDisputed') ? ['disputed-row'] : []
    )
    .and.compareFunction((left, right) => Number(left) - Number(right))
    .and.reducer('sum')
    .and.minColumnWidth(110)
    .and.targetColumnWidth(140)
    .and.maxColumnWidth(180),
};`,
    },
    {
        title: 'Support generated records and legacy form integrations',
        source: `const migrationFields = {
  sampleContact: new FieldType().with
    .exampleValue(index => \`Sample contact \${index + 1}\`),
  legacyAddress: new FieldType().with
    .schema('address'),
  legacyControl: new FieldType().with
    .formElement('legacy-address', { country: 'US' }),
};`,
    },
];

const onboardingCode = `const onboarding = {
  name: new FieldType().with
    .label('Legal name')
    .and.placeholder('Ada Lovelace')
    .and.autocomplete('name')
    .and.minLength(2)
    .and.required(),
  email: new FieldType().with
    .label('Work email')
    .and.type('email')
    .and.placeholder('ada@company.com')
    .and.autocomplete('email')
    .and.requiredWhen(record =>
      String(record.getField('name')).trim().length > 0
    )
    .and.validator({
      name: 'must be a valid email address',
      validate: value => value === '' || /\\S+@\\S+\\.\\S+/.test(String(value)),
    }),
  employmentType: new FieldType().with
    .tag('select')
    .and.label('Employment type')
    .and.options([
      { text: 'Choose a type', value: '' },
      { text: 'Full-time', value: 'full-time' },
      { text: 'Contractor', value: 'contractor' },
    ])
    .and.required(),
  employeeId: new FieldType().with
    .label('Employee ID')
    .and.defaultValue('Assigned after approval')
    .and.readOnly(),
};`;

const orderCode = `const order = {
  fulfillment: new FieldType().with
    .tag('select')
    .and.label('Fulfillment')
    .and.options([
      { text: 'Ship to customer', value: 'ship' },
      { text: 'Store pickup', value: 'pickup' },
    ]),
  address: new FieldType().with
    .label('Shipping address')
    .and.placeholder('12 Market Street, Boston, MA')
    .and.visibleWhen(record => record.getField('fulfillment') === 'ship')
    .and.requiredWhen(record => record.getField('fulfillment') === 'ship'),
  deliveryWindow: new FieldType().with
    .tag('select')
    .and.label('Delivery window')
    .and.disabledWhen(record => record.getField('fulfillment') === 'pickup')
    .and.options([
      { text: '8–10 AM', value: 'morning' },
      { text: '12–2 PM', value: 'midday' },
      { text: '4–6 PM', value: 'afternoon' },
    ]),
  instructions: new FieldType().with
    .tag('textarea')
    .and.label('Delivery instructions')
    .and.rowCount(3)
    .and.maxLength(140)
    .and.placeholder('Loading dock entrance is on 4th Street.')
    .and.emptyWhen(value => String(value).trim() === ''),
};`;

const invoiceCode = `const amount = new FieldType().with
  .formatter(value => currency.format(Number(value)))
  .and.cellClass('numeric')
  .and.textAlign('right')
  .and.conditionalCellClass(value => value > 10000, 'high-value')
  .and.minColumnWidth(100)
  .and.targetColumnWidth(130)
  .and.maxColumnWidth(180)
  .and.reducer('sum');

const status = new FieldType().with
  .template(value => String(value))
  .and.conditionalCellClass(value => value === 'Overdue', 'danger')
  .and.conditionalCellClass(value => value === 'Disputed', 'warning')
  .and.rowClasses(value => value === 'Disputed' ? ['disputed-row'] : []);`;

type Invoice = {
    invoice: string;
    customer: string;
    dueDate: string;
    amount: number;
    status: 'Paid' | 'Due soon' | 'Overdue' | 'Disputed';
};

const invoices: Invoice[] = [
    { invoice: 'INV-1048', customer: 'Northstar Labs', dueDate: 'Jul 18', amount: 12480, status: 'Overdue' },
    { invoice: 'INV-1051', customer: 'Brightline Health', dueDate: 'Jul 29', amount: 6340, status: 'Due soon' },
    { invoice: 'INV-1053', customer: 'Cedar & Co.', dueDate: 'Aug 12', amount: 2180, status: 'Disputed' },
    { invoice: 'INV-1057', customer: 'Tidalworks', dueDate: 'Aug 22', amount: 18900, status: 'Paid' },
];

export class FdlInputDemo extends LitElement {
    private onboarding = new Record(
        {
            name: new FieldType().with
                .label('Legal name')
                .and.placeholder('Ada Lovelace')
                .and.autocomplete('name')
                .and.minLength(2)
                .and.required(),
            email: new FieldType().with
                .label('Work email')
                .and.type('email')
                .and.placeholder('ada@company.com')
                .and.autocomplete('email')
                .and.requiredWhen(record => String(record.getField('name')).trim().length > 0)
                .and.validator({
                    name: 'must be a valid email address',
                    validate: value => value === '' || /^\S+@\S+\.\S+$/.test(String(value)),
                }),
            employmentType: new FieldType().with
                .tag('select')
                .and.label('Employment type')
                .and.options([
                    { text: 'Choose a type', value: '' },
                    { text: 'Full-time', value: 'full-time' },
                    { text: 'Contractor', value: 'contractor' },
                ])
                .and.required(),
            employeeId: new FieldType().with
                .label('Employee ID')
                .and.defaultValue('Assigned after approval')
                .and.readOnly()
                .and.description('The HR system assigns this value after the record is approved.'),
        },
        { name: '', email: '', employmentType: '', employeeId: 'Assigned after approval' }
    );

    private order = new Record(
        {
            fulfillment: new FieldType().with
                .tag('select')
                .and.label('Fulfillment')
                .and.options([
                    { text: 'Ship to customer', value: 'ship' },
                    { text: 'Store pickup', value: 'pickup' },
                ]),
            address: new FieldType().with
                .label('Shipping address')
                .and.placeholder('12 Market Street, Boston, MA')
                .and.visibleWhen(record => record.getField('fulfillment') === 'ship')
                .and.requiredWhen(record => record.getField('fulfillment') === 'ship'),
            deliveryWindow: new FieldType().with
                .tag('select')
                .and.label('Delivery window')
                .and.disabledWhen(record => record.getField('fulfillment') === 'pickup')
                .and.options([
                    { text: '8–10 AM', value: 'morning' },
                    { text: '12–2 PM', value: 'midday' },
                    { text: '4–6 PM', value: 'afternoon' },
                ]),
            instructions: new FieldType().with
                .tag('textarea')
                .and.label('Delivery instructions')
                .and.rowCount(3)
                .and.maxLength(140)
                .and.placeholder('Loading dock entrance is on 4th Street.')
                .and.emptyWhen(value => String(value).trim() === ''),
        },
        { fulfillment: 'ship', address: '', deliveryWindow: 'morning', instructions: '' }
    );

    private invoiceTypes = {
        amount: new FieldType().with
            .formatter(value => currency.format(Number(value)))
            .and.cellClass('numeric')
            .and.textAlign('right')
            .and.conditionalCellClass((value: number) => value > 10000, 'high-value')
            .and.minColumnWidth(100)
            .and.targetColumnWidth(130)
            .and.maxColumnWidth(180)
            .and.reducer('sum'),
        status: new FieldType().with
            .template(value => String(value))
            .and.conditionalCellClass((value: string) => value === 'Overdue', 'danger')
            .and.conditionalCellClass((value: string) => value === 'Disputed', 'warning')
            .and.rowClasses((value: string) => (value === 'Disputed' ? ['disputed-row'] : [])),
    };

    private hasSubmitted = false;

    private errors: { [field: string]: string[] } = {};

    private validationErrors(record: Record) {
        return Object.fromEntries(
            Object.keys(record.fieldTypes).map(field => [field, record.readableFieldErrors(field)])
        );
    }

    private onRecordChange = () => {
        if (this.hasSubmitted) this.errors = this.validationErrors(this.onboarding);
        this.requestUpdate();
    };

    private validate = (event: SubmitEvent) => {
        event.preventDefault();
        this.hasSubmitted = true;
        this.errors = this.validationErrors(this.onboarding);
        this.requestUpdate();
    };

    private resetOnboarding = () => {
        this.onboarding.clear();
        this.hasSubmitted = false;
        this.errors = {};
    };

    private renderErrors(field: string) {
        const errors = this.errors[field] ?? [];
        if (!this.hasSubmitted || errors.length === 0) return nothing;
        return html`<ul class="errors" role="alert">${errors.map(error => html`<li>${error}</li>`)}</ul>`;
    }

    private renderCode(title: string, source: string) {
        return html`<details class="code-panel">
            <summary>${title}</summary>
            <pre><code>${source}</code></pre>
        </details>`;
    }

    private renderField(record: Record, field: string) {
        const fieldType = record.fieldTypeForField(field);
        const element = fieldType.tag() === 'select' ? 'fdl-select' : 'fdl-input';
        return html`<div class="field">
            ${element === 'fdl-select'
                ? html`<fdl-select field=${field} .record=${record}></fdl-select>`
                : html`<fdl-input field=${field} .record=${record}></fdl-input>`}
        </div>`;
    }

    private invoiceClass(invoice: Invoice) {
        return this.invoiceTypes.status.rowClasses(invoice.status, undefined as any).join(' ');
    }

    connectedCallback() {
        super.connectedCallback();
        this.onboarding.addEventListener('change', this.onRecordChange);
        this.order.addEventListener('change', this.onRecordChange);
    }

    disconnectedCallback() {
        this.onboarding.removeEventListener('change', this.onRecordChange);
        this.order.removeEventListener('change', this.onRecordChange);
        super.disconnectedCallback();
    }

    render() {
        const outstanding = invoices
            .filter(invoice => invoice.status !== 'Paid')
            .map(invoice => invoice.amount);
        const totalOutstanding = this.invoiceTypes.amount.aggregate(outstanding);

        return html`
            <main>
                <header class="hero">
                    <p class="eyebrow">Digital FDL · field-type modifiers</p>
                    <h1>Forms that adapt to the work.</h1>
                    <p class="lede">
                        Three realistic workflows show how a field definition can control input,
                        validation, conditional behavior, and data-table presentation.
                    </p>
                    <nav aria-label="Demo sections">
                        <a href="#onboarding">Employee onboarding</a>
                        <a href="#order">Purchase order</a>
                        <a href="#invoices">Invoice table</a>
                        <a href="#cookbook">Modifier cookbook</a>
                    </nav>
                </header>

                <section id="onboarding" class="scenario">
                    <div class="section-heading">
                        <p class="eyebrow">Scenario 01</p>
                        <h2>Employee onboarding</h2>
                        <p>Start typing a legal name: the work email becomes required. Employee ID remains a read-only value supplied by HR.</p>
                    </div>
                    <form class="card" novalidate @submit=${this.validate}>
                        ${this.renderField(this.onboarding, 'name')}
                        ${this.renderErrors('name')}
                        ${this.renderField(this.onboarding, 'email')}
                        ${this.renderErrors('email')}
                        ${this.renderField(this.onboarding, 'employmentType')}
                        ${this.renderErrors('employmentType')}
                        ${this.renderField(this.onboarding, 'employeeId')}
                        <div class="actions">
                            <button type="submit">Validate application</button>
                            <button type="button" class="secondary" @click=${this.resetOnboarding}>Reset</button>
                        </div>
                        ${this.hasSubmitted && this.onboarding.isValid()
                            ? html`<p class="success" role="status">Ready for HR review.</p>`
                            : nothing}
                    </form>
                    <aside class="callout"><code>label · placeholder · autocomplete · type · required · requiredWhen · validator · options · defaultValue · readOnly</code></aside>
                    ${this.renderCode('View the onboarding field types', onboardingCode)}
                </section>

                <section id="order" class="scenario split">
                    <div class="section-heading">
                        <p class="eyebrow">Scenario 02</p>
                        <h2>Purchase order delivery</h2>
                        <p>Switch to store pickup to hide the address and disable the delivery window. The notes field demonstrates a multi-row input.</p>
                    </div>
                    <div class="card">
                        ${this.renderField(this.order, 'fulfillment')}
                        ${this.renderField(this.order, 'address')}
                        ${this.renderField(this.order, 'deliveryWindow')}
                        ${this.renderField(this.order, 'instructions')}
                        <p class="hint">${String(this.order.getField('instructions')).length}/140 characters</p>
                    </div>
                    <aside class="callout"><code>visibleWhen · disabledWhen · requiredWhen · rowCount · maxLength · emptyWhen · tag</code></aside>
                    ${this.renderCode('View the order field types', orderCode)}
                </section>

                <section id="invoices" class="scenario">
                    <div class="section-heading">
                        <p class="eyebrow">Scenario 03</p>
                        <h2>Invoice collection</h2>
                        <p>Field types also define how a table looks and behaves: formatted money, conditional cell styles, row emphasis, and a calculated total.</p>
                    </div>
                    <div class="table-card">
                        <table>
                            <thead><tr><th>Invoice</th><th>Customer</th><th>Due date</th><th class="amount">Amount</th><th>Status</th></tr></thead>
                            <tbody>
                                ${invoices.map(invoice => html`<tr class=${this.invoiceClass(invoice)}>
                                    <td>${invoice.invoice}</td><td>${invoice.customer}</td><td>${invoice.dueDate}</td>
                                    <td class="amount ${this.invoiceTypes.amount.cellClasses(invoice.amount).join(' ')}">${this.invoiceTypes.amount.print(invoice.amount, undefined as any)}</td>
                                    <td><span class="status ${this.invoiceTypes.status.cellClasses(invoice.status).join(' ')}">${this.invoiceTypes.status.print(invoice.status, undefined as any)}</span></td>
                                </tr>`)}
                            </tbody>
                            <tfoot><tr><td colspan="3">Outstanding balance</td><td class="amount">${currency.format(totalOutstanding)}</td><td></td></tr></tfoot>
                        </table>
                    </div>
                    <aside class="callout"><code>formatter · template · cellClass · conditionalCellClass · rowClasses · textAlign · reducer · minColumnWidth · targetColumnWidth · maxColumnWidth</code></aside>
                    ${this.renderCode('View the invoice field types', invoiceCode)}
                </section>

                <section class="reference">
                    <p class="eyebrow">Complete reference</p>
                    <h2>Every builder modifier, grouped by intent.</h2>
                    <div class="modifier-grid">
                        ${modifierGroups.map(([heading, modifiers]) => html`<article><h3>${heading}</h3><p>${modifiers}</p></article>`)}
                    </div>
                    <section id="cookbook" class="modifier-cookbook">
                        <p class="eyebrow">Practical cookbook</p>
                        <h3>Use every modifier in a realistic workflow.</h3>
                        <p>Each example below uses the modifiers from its category in a form or table definition.</p>
                        ${modifierExamples.map(example => this.renderCode(example.title, example.source))}
                    </section>
                    <p class="legacy-note"><code>schema()</code> and <code>formElement()</code> are compatibility APIs; new controls should use <code>tag()</code> and <code>additionalProperties()</code>.</p>
                </section>
            </main>
        `;
    }

    static styles = css`
        :host { display: block; min-height: 100vh; color: #172033; background: #f6f8fc; font-family: Inter, ui-sans-serif, system-ui, sans-serif; }
        main { max-width: 72rem; margin: 0 auto; padding: 0 1.25rem 5rem; }
        .hero { padding: 5.5rem 0 4rem; max-width: 48rem; }
        .eyebrow { margin: 0 0 .6rem; color: #5b52d6; font-size: .75rem; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; }
        h1, h2, h3, p { margin-top: 0; } h1 { max-width: 42rem; margin-bottom: 1rem; color: #111a31; font-family: Georgia, serif; font-size: clamp(2.7rem, 7vw, 5.4rem); font-weight: 500; letter-spacing: -.055em; line-height: .98; }
        h2 { margin-bottom: .6rem; color: #111a31; font-family: Georgia, serif; font-size: clamp(2rem, 4vw, 3rem); font-weight: 500; letter-spacing: -.035em; } h3 { font-size: .9rem; margin-bottom: .35rem; }
        .lede, .section-heading > p:not(.eyebrow) { color: #586174; font-size: 1.1rem; line-height: 1.65; } nav { display: flex; flex-wrap: wrap; gap: .55rem; margin-top: 1.7rem; } nav a { border: 1px solid #d6daea; border-radius: 100px; color: #343b53; padding: .5rem .8rem; text-decoration: none; }
        .scenario { padding: 3.5rem 0; border-top: 1px solid #dfe3ee; } .section-heading { max-width: 42rem; margin-bottom: 1.5rem; }
        .card, .table-card { box-sizing: border-box; border: 1px solid #dfe3ee; border-radius: 1rem; background: white; box-shadow: 0 12px 34px rgba(34, 45, 78, .06); padding: 1.5rem; } .field { margin-bottom: .8rem; } .field:last-of-type { margin-bottom: 0; }
        .actions { display: flex; gap: .6rem; margin-top: 1.25rem; } button { border: 0; border-radius: .5rem; background: #4438c7; color: #fff; cursor: pointer; font: inherit; font-weight: 700; padding: .7rem 1rem; } button.secondary { background: #eceef8; color: #303850; } .errors { color: #b42318; font-size: .85rem; margin: -.45rem 0 .65rem 9rem; } .success { color: #067647; font-weight: 700; margin: 1rem 0 0; } .hint { color: #6b7384; font-size: .82rem; margin: .6rem 0 0 9rem; }
        .callout { margin-top: 1rem; color: #636b7b; font-size: .83rem; line-height: 1.6; } code { color: #4539bf; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: .88em; } .callout code { color: #5d6474; }
        .code-panel { margin-top: 1.25rem; border: 1px solid #dfe3ee; border-radius: .75rem; background: #101629; color: #d8def0; } .code-panel summary { cursor: pointer; color: #d8def0; font-size: .85rem; font-weight: 700; padding: .8rem 1rem; } .code-panel pre { overflow-x: auto; margin: 0; border-top: 1px solid #29314a; padding: 1rem; } .code-panel code { color: #d8def0; font-size: .76rem; line-height: 1.65; white-space: pre; }
        .table-card { overflow-x: auto; padding: .5rem; } table { width: 100%; border-collapse: collapse; min-width: 38rem; } th, td { border-bottom: 1px solid #edf0f5; padding: 1rem; text-align: left; } th { color: #737b8b; font-size: .72rem; letter-spacing: .08em; text-transform: uppercase; } td { font-size: .94rem; } .amount { text-align: right; font-variant-numeric: tabular-nums; } .high-value { font-weight: 800; } .status { border-radius: 100px; background: #edf0f6; color: #485065; font-size: .78rem; font-weight: 800; padding: .3rem .55rem; white-space: nowrap; } .status.danger { background: #ffebe9; color: #b42318; } .status.warning { background: #fff2d8; color: #a15c00; } .disputed-row { background: #fffdf7; } tfoot td { border: 0; color: #182136; font-weight: 800; }
        .reference { padding: 3.5rem 0 0; border-top: 1px solid #dfe3ee; } .modifier-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .8rem; } .modifier-grid article { border: 1px solid #dfe3ee; border-radius: .75rem; background: #fff; padding: 1rem; } .modifier-grid p { color: #667085; font: .78rem/1.6 ui-monospace, SFMono-Regular, Menlo, monospace; margin-bottom: 0; } .modifier-cookbook { margin-top: 3rem; } .modifier-cookbook > h3 { color: #111a31; font-family: Georgia, serif; font-size: 1.65rem; font-weight: 500; letter-spacing: -.025em; } .modifier-cookbook > p:not(.eyebrow) { color: #586174; line-height: 1.6; } .legacy-note { color: #667085; font-size: .9rem; margin: 1.25rem 0 0; }
        @media (max-width: 42rem) { .hero { padding: 3.5rem 0 2.5rem; } .scenario { padding: 2.5rem 0; } .modifier-grid { grid-template-columns: 1fr; } .card { padding: 1rem; } .errors, .hint { margin-left: 0; } }
    `;
}

customElements.define('fdl-input-demo', FdlInputDemo);
