<template>
	<div :class="ns.e('title')">
		<span class="font-size-15px font-500">表格配置</span>
		<div>
			<Button type="primary" @click="() => emit('save')">保存</Button>
			<Button class="ml-12px" @click="() => emit('cancel')">取消</Button>
		</div>
	</div>

	<div :class="ns.e('workbench-body')">
		<div :class="ns.e('workbench-body-center')">
			<div :class="ns.e('workbench-body-center-workspace')">
				<slot name="designer-pane"></slot>
			</div>
		</div>

		<div :class="[ns.e('workbench-body-setting'), 'overflow-auto']">
			<slot name="setting-pane"></slot>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { useNamespace } from '@lt-frame/hooks';
import { Button } from 'ant-design-vue';

const ns = useNamespace('table-designer');

const emit = defineEmits(['cancel', 'save']);
</script>
