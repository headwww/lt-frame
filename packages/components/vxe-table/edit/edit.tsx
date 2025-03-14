import { VxeUI } from 'vxe-table';
import EditInput from './src/edit-input.vue';
import EditInputNumber from './src/edit-input-number.vue';
import EditDatePicker from './src/edit-date-picker.vue';
import EditTimePicker from './src/edit-time-picker.vue';
import EditSelect from './src/edit-select.vue';
import EditEntity from './src/edit-entity.vue';
import EditBool from './src/edit-bool.vue';
import EditEntityPager from './src/edit-entity-pager.vue';

VxeUI.renderer.add('$lt-edit-input', {
	renderEdit({ props = {}, attrs = {}, events = {} }, params) {
		return (
			<EditInput {...props} {...attrs} {...events} params={params}></EditInput>
		);
	},
});

VxeUI.renderer.add('$lt-edit-input-number', {
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

VxeUI.renderer.add('$lt-edit-date-picker', {
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

VxeUI.renderer.add('$lt-edit-time-picker', {
	renderEdit({ props = {}, attrs = {}, events = {} }, params) {
		return (
			<EditTimePicker
				{...props}
				{...attrs}
				{...events}
				params={params}
			></EditTimePicker>
		);
	},
});

VxeUI.renderer.add('$lt-edit-select', {
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

VxeUI.renderer.add('$lt-edit-entity', {
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

VxeUI.renderer.add('$lt-edit-entity-pager', {
	renderEdit({ props = {}, attrs = {}, events = {} }, params) {
		return (
			<EditEntityPager
				{...props}
				{...attrs}
				{...events}
				params={params}
			></EditEntityPager>
		);
	},
});

VxeUI.renderer.add('$lt-edit-bool', {
	renderEdit({ props = {}, attrs = {}, events = {} }, params) {
		return (
			<EditBool {...props} {...attrs} {...events} params={params}></EditBool>
		);
	},
});
