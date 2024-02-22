<template>
	<LTApplication>
		<LTPageLayout
			title="Page组件"
			content="content属性"
			subTitle="二级标题"
			:tags="['tag1', 'tag1', 'tag1']"
			fixedHeight
			dense
		>
			<Loading></Loading>
			<Drawer></Drawer>
			<LTDropdown :dropMenuList="dropMenuList">test</LTDropdown>

			<div></div>
			<LTSvgIcon name="file" color="#DEDEDE" size="32" />
			<LTIcon icon="ion:layers-outline" :size="30" />
			<div>
				<a-button color="success"> 成功 </a-button>
				<a-button color="success" disabled> 禁用 </a-button>
				<a-button color="success" loading> loading </a-button>
				<a-button color="success" type="link"> link </a-button>
				<a-button color="success" type="link" loading> loading link </a-button>
				<a-button color="success" type="link" disabled>
					disabled link
				</a-button>
			</div>
			<div>
				<a-button color="warning"> 警告 </a-button>
				<a-button color="warning" disabled> 禁用 </a-button>
				<a-button color="warning" loading> loading </a-button>
				<a-button color="warning" type="link"> link </a-button>
				<a-button color="warning" type="link" loading> loading link </a-button>
				<a-button color="warning" type="link" disabled>
					disabled link
				</a-button>
			</div>
			<div>
				<a-button color="error"> 错误 </a-button>
				<a-button color="error" disabled> 禁用 </a-button>
				<a-button color="error" loading> loading </a-button>
				<a-button color="error" type="link"> link </a-button>
				<a-button color="error" type="link" loading> loading link </a-button>
				<a-button color="error" type="link" disabled> disabled link </a-button>
			</div>
			<div>
				<a-button ghost color="success"> 幽灵成功 </a-button>
				<a-button ghost color="warning"> 幽灵警告 </a-button>
				<a-button ghost color="error"> 幽灵错误 </a-button>
				<a-button ghost type="dashed" color="warning">
					幽灵警告dashed
				</a-button>
				<a-button ghost danger> 幽灵危险 </a-button>
			</div>
			<div>
				<a-button type="primary" preIcon="mdi:page-next-outline">
					主按钮
				</a-button>
				<a-button type="primary" disabled> 禁用 </a-button>
				<a-button type="primary" danger preIcon="mdi:page-next-outline">
					危险
				</a-button>
				<a-button type="primary" loading> loading </a-button>
				<a-button type="link"> link </a-button>
				<a-button type="link" loading> loading link </a-button>
				<a-button type="link" disabled> disabled link </a-button>
			</div>
			<div>
				<a-button type="default"> 默认 </a-button>
				<a-button type="default" disabled> 禁用 </a-button>
				<a-button type="default" danger> 危险 </a-button>
				<a-button type="default" loading> loading </a-button>
				<a-button type="link"> link </a-button>
				<a-button type="link" loading> loading link </a-button>
				<a-button type="link" disabled> disabled link </a-button>
			</div>
			<div>
				<a-button type="dashed"> dashed </a-button>
				<a-button type="dashed" disabled> 禁用 </a-button>
				<a-button type="dashed" danger> 危险 </a-button>
				<a-button type="dashed" loading> loading </a-button>
			</div>

			<div>
				<div style="background-color: #8b8b8be6; padding: 10px">
					<a-button ghost type="primary"> 幽灵主要 </a-button>
					<a-button ghost type="default"> 幽灵默认 </a-button>
					<a-button ghost type="dashed"> 幽灵dashed </a-button>
					<a-button ghost type="primary" disabled> 禁用 </a-button>
					<a-button ghost type="primary" loading> loading </a-button>
				</div>
			</div>
			<Hook style="left: auto" @click="() => {}">
				<template>aaa</template>
				<template #title>aaa</template>
			</Hook>
			<LTArrow @click="handleArrow" :expand="!isAdvanced" up></LTArrow>
			<LTPopConfirmButton color="success" title="Are you sure delete this task?"
				>确定</LTPopConfirmButton
			>

			<LTDescription title="基础实例" :schema="schema" :data="data">
				<template #extra>
					<a-button color="error"> 错误 </a-button>
				</template>
			</LTDescription>
			<LTDescription
				style="margin-top: 20px"
				:column="3"
				bordered
				title="带边框垂直的表格"
				:schema="schema"
				:data="data"
				layout="vertical"
			></LTDescription>
			<LTDescription style="margin-top: 20px" @register="register" />
			<Scorll></Scorll>
			<List></List>
		</LTPageLayout>
	</LTApplication>
</template>
<script setup lang="ts">
import {
	LTSvgIcon,
	LTIcon,
	LTButton as AButton,
	LTApplication,
	LTArrow,
	LTPopConfirmButton,
	LTDescription,
	DescItem,
	LTDropdown,
	DropMenu,
	LTPageLayout,
} from '@lt-frame/components';
import { ref, reactive } from 'vue';
import { useDescription } from '@lt-frame/hooks';
import Hook from './Hook.vue';
import Scorll from './Scorll.vue';
import Drawer from './drawer/index.vue';
import Loading from './loading/index.vue';
import List from './virtual/index.vue';

const isAdvanced = ref(false);

function handleArrow() {
	isAdvanced.value = !isAdvanced.value;
}

const data = reactive({
	field1: 'tom',
	field2: '98',
	field3: 'field3',
	field4: 'phone',
});

const schema: DescItem[] = [
	{
		field: 'field1',
		label: '自定义label样式',
		contentMinWidth: 2,
		render: (val) => `自定义渲染-${val}`,
		show: () => true,
		labelStyle: {
			color: '#3370ff',
		},
		isCopyEnabled: true,
	},
	{
		field: 'field2',
		label: '复制',
	},
	{
		field: 'field3',
		label: 'tip',
		isTip: true,
		tip: '提示内容',
	},
	{
		field: 'field4',
		label: '自定义field样式',
		fieldStyle: {
			color: '#3370ff',
		},
	},
];
const [register] = useDescription({
	title: 'useDescription',
	data,
	schema,
});

const dropMenuList: DropMenu[] = [
	{
		text: 'text1',
		event: 'e1',
	},
	{
		text: 'text2',
		event: 'e2',
	},
];
</script>
