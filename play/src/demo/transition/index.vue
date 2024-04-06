<template>
	<LtPageLayout title="动画组件示例">
		<div>
			<a-select
				:options="options"
				v-model:value="value"
				placeholder="选择动画"
				:style="{ width: '150px' }"
			></a-select>

			<a-button type="primary" @click="start"> start </a-button>
		</div>
		<component :is="`${value}Transition`">
			<div class="box" v-show="show"></div>
		</component>
	</LtPageLayout>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { Select as ASelect, Button as AButton } from 'ant-design-vue';
import {
	LtPageLayout,
	LtFadeTransition,
	LtScaleTransition,
	LtSlideYTransition,
	LtScrollYTransition,
	LtSlideYReverseTransition,
	LtScrollYReverseTransition,
	LtSlideXTransition,
	LtScrollXTransition,
	LtSlideXReverseTransition,
	LtScrollXReverseTransition,
	LtScaleRotateTransition,
	LtExpandXTransition,
	LtExpandTransition,
} from '@lt-frame/components';

const transitionList = [
	'LtFade',
	'LtScale',
	'LtSlideY',
	'LtScrollY',
	'LtSlideYReverse',
	'LtScrollYReverse',
	'LtSlideX',
	'LtScrollX',
	'LtSlideXReverse',
	'LtScrollXReverse',
	'LtScaleRotate',
	'LtExpandX',
	'LtExpand',
];
const options = transitionList.map((item) => ({
	label: item,
	value: item,
	key: item,
}));

export default defineComponent({
	components: {
		AButton,
		ASelect,
		LtPageLayout,
		LtFadeTransition,
		LtScaleTransition,
		LtSlideYTransition,
		LtScrollYTransition,
		LtSlideYReverseTransition,
		LtScrollYReverseTransition,
		LtSlideXTransition,
		LtScrollXTransition,
		LtSlideXReverseTransition,
		LtScrollXReverseTransition,
		LtScaleRotateTransition,
		LtExpandXTransition,
		LtExpandTransition,
	},
	setup() {
		const value = ref('Fade');
		const show = ref(true);
		function start() {
			show.value = false;
			setTimeout(() => {
				show.value = true;
			}, 300);
		}
		return { options, value, start, show };
	},
});
</script>
<style lang="scss" scoped>
.box {
	width: 150px;
	height: 150px;
	margin-top: 20px;
	background-color: rgb(126 170 236);
}
</style>
