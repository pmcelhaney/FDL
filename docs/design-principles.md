# FDL design principles

FDL is a language for describing fields, records, and recordsets independently
of the components that render them. A field definition should capture reusable
meaning and behavior so forms, tables, printed output, filters, tests, and other
consumers can interpret the same definition consistently.

This document defines the boundary for adding modifiers to `FieldType`.

## What a modifier is

A modifier adds one focused piece of declarative behavior to a field type and
returns a new field type. It answers a question about the field rather than
issuing instructions to a particular component.

Good modifiers describe concepts such as:

- how a value is parsed, formatted, compared, filtered, or aggregated;
- what makes a value valid or empty;
- whether a field is required, visible, disabled, or read-only in the context
  of a record;
- how values relate to available options or other fields;
- stable presentation intent that multiple consumers can interpret, such as
  text alignment, column-width guidance, or semantic cell classes.

For example, `formatter(currency)`, `requiredWhen(isInternational)`, and
`compareFunction(compareDates)` describe field behavior. They do not need to
know which component, framework, or HTML element will consume them.

## Properties of a good modifier

### Declarative

A modifier records what is true about a field. It should not perform rendering,
query the DOM, manage component lifecycle, or dispatch UI events.

### Reusable across consumers

The modifier should remain meaningful outside the component that motivated it.
A form and a table may interpret a modifier differently, but its intent should
survive that change of consumer.

Presentation modifiers are acceptable when they express a stable concept in
FDL's vocabulary. `textAlign('right')` expresses intent that HTML, a PDF
renderer, and a spreadsheet exporter could all honor. Choosing a custom-element
tag or setting one component's private property does not.

### Composable

Modifiers must preserve immutable specialization: applying one returns a new
`FieldType` and leaves the source definition unchanged.

When multiple applications make sense, behavior should compose predictably.
Formatters and parsers form ordered pipelines; validators accumulate;
visibility predicates all apply. When a modifier replaces a scalar value, that
replacement rule should be clear and tested.

### Enforced by the model when it is model behavior

If a modifier claims that a value is invalid, constrained, or transformed, the
FDL model must enforce that claim. Merely copying a browser attribute does not
make it an FDL validation rule. `Record#isValid()` and a rendered control should
not disagree about the same declared rule.

### Open to application behavior

Prefer callbacks and small, typed configuration objects that let applications
extend behavior without adding a modifier for every special case. This keeps
the vocabulary compact and follows the open-closed principle: new rules can be
defined without changing FDL itself.

### Observable and testable without a production UI

A modifier's contract should be demonstrable through `FieldType`, `Record`, or
`Recordset`, or through more than one representative consumer. Its tests should
verify behavior, immutability, and composition rather than only checking that a
property was stored.

## What a modifier is not

A modifier should not be:

- a raw HTML attribute or DOM property;
- a selector for a tag, custom element, or framework component;
- an arbitrary bag of properties forwarded to a renderer;
- a component lifecycle hook or event-handler shortcut;
- a compatibility flag for one design-system control;
- a workaround for inconsistent property names in downstream components;
- a browser constraint that is not also represented in FDL validation;
- imperative orchestration that mutates other fields after a UI event.

Those concerns may be necessary, but they belong at a different boundary.

| Concern | Where it belongs |
| --- | --- |
| HTML tag, native attribute, focus behavior | Form renderer or adapter |
| Custom-element properties and events | Design-system integration |
| Derived values and cross-field updates | Record or application model |
| Business validation and dependencies | Field type and record |
| Formatting, parsing, comparison, filtering | Field type |
| Screen-specific layout and label placement | View or renderer |

An adapter can combine a field's semantic definition with local rendering
configuration. Keeping those inputs separate allows the same `FieldType` to be
rendered by Lit today and another UI, document, or export system later.

## Reviewing a proposed modifier

Before adding a public modifier, answer these questions:

1. What field-level question does it answer?
2. Would the answer still make sense with a different renderer?
3. Can existing callbacks or configuration express the behavior already?
4. Is it model behavior, renderer behavior, or application orchestration?
5. If it describes validation or transformation, does `Record` enforce it?
6. How does it compose when inherited or applied more than once?
7. Can its behavior be tested without asserting an internal stored property?
8. Can a live example demonstrate the contract honestly?

If the proposal fails the renderer-independence test, add it to the renderer or
integration layer. If it is a one-off application rule, supply a callback to an
existing modifier. Add a new modifier only when it expands FDL's reusable field
language.

## Implementation requirements

When a new modifier is justified:

- return a new `FieldType`; never mutate the source definition;
- clone and extend collection properties rather than sharing mutable arrays;
- give callbacks precise argument and return types;
- document ordering, accumulation, and override behavior;
- expose behavior through `FieldType`, `Record`, or `Recordset` as appropriate;
- add focused tests for behavior, immutability, and composition;
- update public documentation, declarations, and examples together.

The goal is not to maximize the number of modifiers. It is to maintain a small,
coherent language that keeps field behavior reusable and presentation code
focused on rendering.
