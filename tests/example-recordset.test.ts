import ExampleRecordset from '../example-recordset';
import Recordset from '../recordset';
import FieldType from '../field-type.js';

interface ExampleData {
    name: string;
    info: string;
}

let exampleRecordset: Recordset<ExampleData>;
const nameOnRow = (index:number) => exampleRecordset.allRecords[index].values.name as string;

describe('An Example Recordset', () => {
    beforeEach(() => {
        exampleRecordset = new ExampleRecordset<ExampleData>(
            {
                name: new FieldType<string>().with.exampleValue(() => 'Bobby'),
                info: new FieldType<string>().with.exampleValue(() => 'administrator'),
            },
            5
        );
    });

    it('exists', async () => {
        await exampleRecordset.requestUpdate();
        expect(exampleRecordset).toBeDefined();
        expect(exampleRecordset.allRecords.length).toEqual(5);
    });
    it('creates a recordset with example data', async () => {
        await exampleRecordset.requestUpdate();
        expect(nameOnRow(0)).toEqual('Bobby');
    });
});
