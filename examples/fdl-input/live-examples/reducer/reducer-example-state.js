import { createReducerType, createProbes } from './reducer-model.js';
// Tutorial state for the .reducer() example.
import { ExampleController } from '../../example-controller';

export class ExampleModel extends ExampleController {
    modifier = 'reducer';
    reducerType = createReducerType();
    probes = createProbes();
}
