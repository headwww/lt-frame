<template>
	<LtPageLayout :contentBackground="false">
		<LtTableDesigner>
			<template #n>
				<VueDraggable
					v-model="list1"
					:animation="150"
					:group="{ name: 'people', pull: 'clone', put: false }"
					:clone="clone"
					:sort="false"
					style="
						display: flex;
						flex-wrap: wrap;
						justify-content: flex-start;
						align-items: flex-start;
						gap: 10px;
					"
				>
					<div
						v-for="item in list1"
						:key="item.id"
						style="
							flex: 0 0 calc(50% - 10px);
							box-sizing: border-box;
							padding: 10px;
							border: 1px solid #ccc;
							margin-bottom: 10px;
						"
					>
						{{ item.name }}
					</div>
				</VueDraggable>
			</template>
			<template #w>
				<VueDraggable
					v-model="list2"
					:animation="150"
					group="people"
					ghostClass="ghost"
					class="flex gap-2 p-4 w-300px w-full m-auto bg-gray-500/5 rounded overflow-auto"
				>
					<div
						v-for="item in list2"
						:key="item.id"
						class="cursor-move w-100px h-50px min-w-100px bg-gray-500/5 rounded p-3"
					>
						{{ item.name }}
					</div>
				</VueDraggable>
			</template>
		</LtTableDesigner>
	</LtPageLayout>
</template>

<script lang="ts" setup>
import {
	LtTableDesigner,
	LtPageLayout,
	LtDraggable as VueDraggable,
} from '@lt-frame/components';
import { ref } from 'vue';

const list1 = ref([
	{
		name: 'Joao',
		id: '1',
	},
	{
		name: 'Jean',
		id: '2',
	},
	{
		name: 'Johanna',
		id: '3',
	},
	{
		name: 'Juan',
		id: '4',
	},
]);
const list2 = ref(
	list1.value.map((item) => ({
		name: `${item.name}-2`,
		id: `${item.id}-2`,
	}))
);

function clone(element: Record<'name' | 'id', string>) {
	const len = list2.value.length;
	return {
		name: `${element.name}-clone-${len}`,
		id: `${element.id}-clone-${len}`,
	};
}
</script>
<style lang="scss">
.ghost {
	position: relative;
	box-sizing: border-box;
	// 拖放移动中;
	min-height: 35px;
	padding: 0 !important;
	overflow: hidden;

	&::before {
		content: '';
		position: absolute;
		top: 0;
		right: 0;
		width: 100%;
		height: 5px;
		background-color: #e4e40c;
	}
}
</style>
