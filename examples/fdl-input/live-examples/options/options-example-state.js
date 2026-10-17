import { createModel } from './options-model.js';
// Tutorial state for the .options() example.
import { ExampleController } from '../../example-controller';
import { field } from '@pmcelhaney/fdl';

export class ExampleModel extends ExampleController {
    modifier = 'options';
    optionsDepartment = '';
    assigneeChoices = [];
    optionsLoading = false;
    record = createModel();
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
