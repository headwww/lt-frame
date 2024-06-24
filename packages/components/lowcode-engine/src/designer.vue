<template>
	<div :class="ns.e('title')">
		<span :class="ns.e('title__text')">表格配置</span>
		<div>
			<Button :loading="loading" type="primary" @click="() => emit('save')"
				>保存</Button
			>
			<Button style="margin-left: 12px" @click="() => emit('cancel')"
				>取消</Button
			>
		</div>
	</div>

	<div :class="ns.e('workbench-body')">
		<div :class="ns.e('workbench-body-center')">
			<div :class="ns.e('workbench-body-center-workspace')">
				<slot name="designer-pane"></slot>
			</div>
		</div>

		<div style="overflow: auto" :class="[ns.e('workbench-body-setting')]">
			<slot name="setting-pane"></slot>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { useNamespace } from '@lt-frame/hooks';
import { Button } from 'ant-design-vue';

const ns = useNamespace('table-designer');

const emit = defineEmits(['cancel', 'save']);

defineProps({
	loading: { type: Boolean, defalut: false },
});
</script>
