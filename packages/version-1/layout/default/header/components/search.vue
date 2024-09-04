<template>
	<div>
		<a-input
			ref="target"
			style="width: 400px"
			size="large"
			placeholder="搜索菜单导航、组织数据、数据字典..."
		>
			<template #prefix>
				<SearchOutlined style="color: #8f959e" />
			</template>
		</a-input>
	</div>
</template>

<script lang="ts" setup>
import { Input as AInput } from 'ant-design-vue';
import { useFocus } from '@vueuse/core';
import { ref } from 'vue';
import { SearchOutlined } from '@ant-design/icons-vue';

const target = ref();

const { focused } = useFocus(target);

focused;
</script>
