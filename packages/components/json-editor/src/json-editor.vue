<template>
	<div ref="jsonEditorContainer"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch, PropType } from 'vue';
import JSONEditor, { JSONEditorOptions } from 'jsoneditor';

export default defineComponent({
	name: 'LtJsonEditor',
	props: {
		modelValue: {
			type: Object as PropType<object>,
			required: true,
		},
		options: {
			type: Object as PropType<JSONEditorOptions>,
			default: () => ({ mode: 'tree' }),
		},
	},
	emits: ['update:modelValue'],
	setup(props, { emit }) {
		const jsonEditorContainer = ref<HTMLDivElement | null>(null);
		let jsonEditor: JSONEditor | null = null;

		onMounted(() => {
			if (jsonEditorContainer.value) {
				jsonEditor = new JSONEditor(jsonEditorContainer.value, {
					...props.options,
					onChange: () => {
						if (jsonEditor) {
							try {
								const updatedValue = jsonEditor.get();
								emit('update:modelValue', updatedValue);
							} catch (error) {
								// eslint-disable-next-line no-console
								console.error('Error parsing JSON:', error);
							}
						}
					},
					onEvent: (node, event) => {
						if (event.type === 'contextmenu') {
							event.preventDefault();
						}
					},
				});
				jsonEditor.set(props.modelValue);
			}
		});

		watch(
			() => props.modelValue,
			(newValue) => {
				if (jsonEditor && newValue !== jsonEditor.get()) {
					jsonEditor.update(newValue);
				}
			},
			{ deep: true }
		);

		function getJsonEditor() {
			return jsonEditor;
		}

		return {
			jsonEditorContainer,
			getJsonEditor,
		};
	},
});
</script>
