export type PaymentStatus = "Draft" | "Ready" | "Approved";
export type PaymentMethod = "ACH" | "Paper check" | "International wire";

export type Payment = {
  id: string;
  destinationState: "NC" | "SC" | "GA" | "PR";
  agency: string;
  method: PaymentMethod;
  routingNumber: string;
  accountNumber: string;
  amount: number | null;
  status: PaymentStatus;
  complianceReference: string;
};

export type FieldKey = keyof Payment;
export type Option = { value: string; label: string };

export type FieldDefinition<K extends FieldKey = FieldKey> = {
  key: K;
  label: string;
  hint?: string;
  control: "text" | "select";
  inputMode?: "decimal" | "numeric" | "text";
  options?: (record: Payment) => Option[];
  visible?: (record: Payment) => boolean;
  required?: (record: Payment) => boolean;
  disabled?: (record: Payment) => boolean;
  parse: (input: string) => Payment[K];
  format: (value: Payment[K], context: "input" | "display" | "export") => string;
  validate?: (value: Payment[K], record: Payment) => string | null;
  table?: boolean;
  numeric?: boolean;
  width?: number;
  rule: string;
};

export const jurisdictions: Option[] = [
  { value: "NC", label: "North Carolina" },
  { value: "SC", label: "South Carolina" },
  { value: "GA", label: "Georgia" },
  { value: "PR", label: "Puerto Rico" },
];

const agencies: Record<Payment["destinationState"], Option[]> = {
  NC: [
    { value: "wake", label: "Wake County CSE" },
    { value: "mecklenburg", label: "Mecklenburg County CSE" },
  ],
  SC: [
    { value: "sc-central", label: "SC Central Disbursement Unit" },
    { value: "greenville", label: "Greenville County DSS" },
  ],
  GA: [
    { value: "ga-central", label: "Georgia Family Support Registry" },
    { value: "fulton", label: "Fulton County DCSS" },
  ],
  PR: [
    { value: "asume", label: "ASUME Central Registry" },
    { value: "san-juan", label: "ASUME — San Juan" },
  ],
};

const methodOptions: Option[] = [
  { value: "ACH", label: "ACH" },
  { value: "Paper check", label: "Paper check" },
  { value: "International wire", label: "International wire" },
];

const statusOptions: Option[] = [
  { value: "Draft", label: "Draft" },
  { value: "Ready", label: "Ready for approval" },
  { value: "Approved", label: "Approved — locked" },
];

const text = (value: unknown) => String(value ?? "");
const digits = (value: string) => value.replace(/\D/g, "");
const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export const fieldDefinitions: FieldDefinition[] = [
  {
    key: "id",
    label: "Payment ID",
    control: "text",
    parse: text,
    format: text,
    table: true,
    width: 132,
    disabled: () => true,
    rule: ".disabledWhen(() => true)",
  },
  {
    key: "destinationState",
    label: "Destination jurisdiction",
    hint: "Changes the available receiving agencies and exception policy.",
    control: "select",
    options: () => jurisdictions,
    parse: (value) => value as Payment["destinationState"],
    format: (value) => jurisdictions.find((item) => item.value === value)?.label ?? text(value),
    table: true,
    width: 190,
    rule: ".options(jurisdictions).required()",
  },
  {
    key: "agency",
    label: "Receiving agency",
    hint: "Options depend on the destination jurisdiction.",
    control: "select",
    options: (record) => agencies[record.destinationState],
    required: () => true,
    parse: text,
    format: (value) =>
      Object.values(agencies).flat().find((item) => item.value === value)?.label ?? text(value),
    validate: (value) => (value ? null : "Choose the receiving agency."),
    table: true,
    width: 224,
    rule: ".options(({ destinationState }) => agencies[destinationState]).required()",
  },
  {
    key: "method",
    label: "Payment method",
    control: "select",
    options: () => methodOptions,
    parse: (value) => value as PaymentMethod,
    format: text,
    table: true,
    width: 166,
    rule: ".options(paymentMethods).required()",
  },
  {
    key: "routingNumber",
    label: "Routing number",
    hint: "Nine digits for ACH; 8–11 alphanumeric characters for an international wire.",
    control: "text",
    inputMode: "numeric",
    visible: (record) => record.method !== "Paper check",
    required: (record) => record.method !== "Paper check",
    disabled: (record) => record.status === "Approved",
    parse: (value) => (value.match(/[A-Za-z]/) ? value.replace(/[^A-Za-z0-9]/g, "").toUpperCase() : digits(value).slice(0, 9)),
    format: text,
    validate: (value, record) => {
      if (record.method === "Paper check") return null;
      if (!value) return "Enter a routing number.";
      if (record.method === "ACH" && !/^\d{9}$/.test(value)) return "ACH routing numbers contain exactly nine digits.";
      if (record.method === "International wire" && !/^[A-Z0-9]{8,11}$/.test(value)) return "Wire routing codes contain 8–11 letters or digits.";
      return null;
    },
    rule: ".visibleWhen(isElectronic).requiredWhen(isElectronic).disabledWhen(isApproved)",
  },
  {
    key: "accountNumber",
    label: "Account number",
    hint: "Fictional data only. Review surfaces always mask the value.",
    control: "text",
    inputMode: "numeric",
    visible: (record) => record.method !== "Paper check",
    required: (record) => record.method !== "Paper check",
    disabled: (record) => record.status === "Approved",
    parse: (value) => value.replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, 17),
    format: (value, context) => {
      const plain = text(value);
      if (context === "input") return plain;
      return plain ? `•••• ${plain.slice(-4)}` : "—";
    },
    validate: (value, record) => {
      if (record.method === "Paper check") return null;
      return text(value).length >= 4 ? null : "Enter at least four account-number characters.";
    },
    rule: ".visibleWhen(isElectronic).formatter(maskAccount).disabledWhen(isApproved)",
  },
  {
    key: "amount",
    label: "Disbursement amount",
    hint: "Typed currency is parsed to a numeric model value.",
    control: "text",
    inputMode: "decimal",
    required: () => true,
    disabled: (record) => record.status === "Approved",
    parse: (value) => {
      const parsed = Number(value.replace(/[$,\s]/g, ""));
      return Number.isFinite(parsed) ? parsed : null;
    },
    format: (value, context) => value == null ? "" : context === "input" ? String(value) : money.format(value),
    validate: (value) => value != null && value > 0 ? null : "Enter an amount greater than zero.",
    table: true,
    numeric: true,
    width: 162,
    rule: ".parser(parseCurrency).formatter(currency).disabledWhen(isApproved)",
  },
  {
    key: "status",
    label: "Workflow status",
    hint: "Approved payments lock editable financial fields.",
    control: "select",
    options: () => statusOptions,
    parse: (value) => value as PaymentStatus,
    format: text,
    table: true,
    width: 142,
    rule: ".options(statuses)",
  },
  {
    key: "complianceReference",
    label: "Compliance / exception reference",
    hint: "Required for Puerto Rico and international wire destinations.",
    control: "text",
    visible: (record) => record.destinationState === "PR" || record.method === "International wire",
    required: (record) => record.destinationState === "PR" || record.method === "International wire",
    disabled: (record) => record.status === "Approved",
    parse: (value) => value.trim().toUpperCase().replace(/\s+/g, "-").slice(0, 24),
    format: (value) => text(value) || "—",
    validate: (value, record) => {
      const required = record.destinationState === "PR" || record.method === "International wire";
      return required && !value ? "Add the compliance or exception reference." : null;
    },
    table: true,
    width: 210,
    rule: ".visibleWhen(exceptionRoute).requiredWhen(exceptionRoute).parser(normalizeReference)",
  },
];

export const initialPayment: Payment = {
  id: "PAY-2048",
  destinationState: "NC",
  agency: "wake",
  method: "ACH",
  routingNumber: "053000219",
  accountNumber: "7812331049",
  amount: 1264.5,
  status: "Draft",
  complianceReference: "",
};

export const samplePayments: Payment[] = [
  initialPayment,
  { ...initialPayment, id: "PAY-2049", destinationState: "SC", agency: "sc-central", amount: 875, status: "Ready", accountNumber: "9933004178" },
  { ...initialPayment, id: "PAY-2050", destinationState: "PR", agency: "asume", amount: 2140.75, status: "Ready", complianceReference: "PR-EX-4481", accountNumber: "6104722288" },
  { ...initialPayment, id: "PAY-2051", destinationState: "GA", agency: "ga-central", method: "Paper check", routingNumber: "", accountNumber: "", amount: 460.2, status: "Approved" },
];

export function isVisible(definition: FieldDefinition, record: Payment) {
  return definition.visible?.(record) ?? true;
}

export function isRequired(definition: FieldDefinition, record: Payment) {
  return definition.required?.(record) ?? false;
}

export function isDisabled(definition: FieldDefinition, record: Payment) {
  return definition.disabled?.(record) ?? false;
}

export function errorsFor(record: Payment) {
  return fieldDefinitions.flatMap((definition) => {
    if (!isVisible(definition, record)) return [];
    const value = record[definition.key] as never;
    const message = definition.validate?.(value, record);
    if (message) return [{ key: definition.key, label: definition.label, message }];
    if (isRequired(definition, record) && (value === "" || value == null)) {
      return [{ key: definition.key, label: definition.label, message: `${definition.label} is required.` }];
    }
    return [];
  });
}

export function activeRule(record: Payment) {
  if (record.destinationState === "PR") return fieldDefinitions.find((field) => field.key === "complianceReference")!;
  if (record.method === "International wire") return fieldDefinitions.find((field) => field.key === "complianceReference")!;
  if (record.method === "Paper check") return fieldDefinitions.find((field) => field.key === "routingNumber")!;
  if (record.status === "Approved") return fieldDefinitions.find((field) => field.key === "amount")!;
  return fieldDefinitions.find((field) => field.key === "agency")!;
}
