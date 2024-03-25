import { VXETable } from 'vxe-table';
import EditInput from './src/edit-input.vue';
import EditInputNumber from './src/edit-input-number.vue';
import EditDatePicker from './src/edit-date-picker.vue';
import EditSelect from './src/edit-select.vue';
import EditEntity from './src/edit-entity.vue';

VXETable.renderer.add('$editInput', {
	renderEdit({ props = {}, attrs = {}, events = {} }, params) {
		return (
			<EditInput {...props} {...attrs} {...events} params={params}></EditInput>
		);
	},
});

VXETable.renderer.add('$editInputNumber', {
	renderEdit({ props = {}, attrs = {}, events = {} }, params) {
		return (
			<EditInputNumber
				{...props}
				{...attrs}
				{...events}
				params={params}
			></EditInputNumber>
		);
	},
});

VXETable.renderer.add('$editDatePicker', {
	renderEdit({ props = {}, attrs = {}, events = {} }, params) {
		return (
			<EditDatePicker
				{...props}
				{...attrs}
				{...events}
				params={params}
			></EditDatePicker>
		);
	},
});

VXETable.renderer.add('$editSelect', {
	renderEdit({ props = {}, attrs = {}, events = {} }, params) {
		return (
			<EditSelect
				{...props}
				{...attrs}
				{...events}
				params={params}
			></EditSelect>
		);
	},
});

VXETable.renderer.add('$editEntity', {
	renderEdit({ props = {}, attrs = {}, events = {} }, params) {
		return (
			<EditEntity
				{...props}
				{...attrs}
				{...events}
				params={params}
			></EditEntity>
		);
	},
});
