import { VXETable } from 'vxe-table';
import EditInput from './src/edit-input.vue';
import EditInputNumber from './src/edit-input-number.vue';
import EditDatePicker from './src/edit-date-picker.vue';
import EditSelect from './src/edit-select.vue';
import EditEntity from './src/edit-entity.vue';

VXETable.renderer.add('$lt-edit-input', {
	renderEdit({ props = {}, attrs = {}, events = {} }, params) {
		return (
			<EditInput {...props} {...attrs} {...events} params={params}></EditInput>
		);
	},
});

VXETable.renderer.add('$lt-edit-input-number', {
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

VXETable.renderer.add('$lt-edit-date-picker', {
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

VXETable.renderer.add('$lt-edit-select', {
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

VXETable.renderer.add('$lt-edit-entity', {
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
