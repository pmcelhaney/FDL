// Field rules and state for the .options() example.
import { ExampleController } from '../../example-controller';
import { field } from '../../../../src/index';
import { assigneeDirectory, optionsDelay } from '../../assignee-options';
import Record from '../../../../src/record.js';

export class ExampleModel extends ExampleController {
    modifier = 'options';
    optionsDepartment = '';
    assigneeChoices = [];
    optionsLoading = false;
    record = new Record(
        {
            department: field.label('Department').options([
                { text: 'Engineering', value: 'engineering' },
                { text: 'Finance', value: 'finance' },
            ]),
            assignee: field
                .label('Assignee (function)')
                .options(
                    record => assigneeDirectory[record.getField('department')]
                ),
            asyncAssignee: field
                .label('Assignee (async function)')
                .options(async record => {
                    const choices =
                        assigneeDirectory[record.getField('department')];
                    await new Promise(resolve =>
                        setTimeout(resolve, optionsDelay)
                    );
                    return choices;
                }),
        },
        {
            department: 'engineering',
            assignee: 'margaret',
            asyncAssignee: 'margaret',
        }
    );
    async loadAssigneeChoices() {
        const department = this.record.getField('department');
        if (department === this.optionsDepartment) return;
        this.optionsDepartment = department;
        this.optionsLoading = true;
        this.requestUpdate();
        const choices = await this.record.field('assignee').options();
        if (department !== this.optionsDepartment) return;
        this.assigneeChoices = choices;
        this.optionsLoading = false;
        this.requestUpdate();
    }
}
