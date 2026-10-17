import { createHashType, record } from './hashFunction-model.js';
// Tutorial state for the .hashFunction() example.
import { ExampleController } from '../../example-controller';

export class ExampleModel extends ExampleController {
    modifier = 'hashFunction';
    hashType = createHashType();
    probes = record;
}
