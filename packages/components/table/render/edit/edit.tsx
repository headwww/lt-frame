import { VXETable } from 'vxe-table';
import EditInput from './edit-input.vue';
import EditInputNumber from './edit-input-number.vue';
import EditDate from './edit-date.vue';
import EditTime from './edit-time.vue';
import EditSelect from './edit-select.vue';
import EditTable from './edit-table.vue';

VXETable.renderer.add('Edit-Input', {
	renderEdit(renderOpts, params) {
		return (
			<EditInput
				{...renderOpts.attrs}
				{...renderOpts.events}
				{...renderOpts.props}
				params={params}
			></EditInput>
		);
	},
});

VXETable.renderer.add('Edit-InputNumber', {
	renderEdit(renderOpts, params) {
		return (
			<EditInputNumber
				{...renderOpts.attrs}
				{...renderOpts.events}
				{...renderOpts.props}
				params={params}
			></EditInputNumber>
		);
	},
});

VXETable.renderer.add('Edit-Date', {
	renderEdit(renderOpts, params) {
		return (
			<EditDate
				{...renderOpts.attrs}
				{...renderOpts.events}
				{...renderOpts.props}
				params={params}
			></EditDate>
		);
	},
});

VXETable.renderer.add('Edit-Time', {
	renderEdit(renderOpts, params) {
		return (
			<EditTime
				{...renderOpts.attrs}
				{...renderOpts.events}
				{...renderOpts.props}
				params={params}
			></EditTime>
		);
	},
});

VXETable.renderer.add('Edit-Select', {
	renderEdit(renderOpts, params) {
		return (
			<EditSelect
				{...renderOpts.attrs}
				{...renderOpts.events}
				{...renderOpts.props}
				params={params}
			></EditSelect>
		);
	},
});

VXETable.renderer.add('Edit-Table', {
	renderEdit(renderOpts, params) {
		return (
			<EditTable
				{...renderOpts.attrs}
				{...renderOpts.events}
				params={params}
				tableDatePromise={renderOpts.props?.tableDatePromise}
				tableDate={renderOpts.props?.tableDate}
				colConfigs={renderOpts.props?.colConfigs}
			></EditTable>
		);
	},
});
