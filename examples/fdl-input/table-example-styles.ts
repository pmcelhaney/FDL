import { unsafeCSS } from 'lit';
import columnClass from './live-examples/columnClass/example.css?raw';
import cellClass from './live-examples/cellClass/example.css?raw';
import template from './live-examples/template/example.css?raw';
import rowClass from './live-examples/rowClass/example.css?raw';
export const tableExampleStyles = {
    columnClass: unsafeCSS(columnClass),
    cellClass: unsafeCSS(cellClass),
    template: unsafeCSS(template),
    rowClass: unsafeCSS(rowClass),
};
