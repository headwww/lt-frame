<template>
	<div class="acg-box">
		<div class="acg-box-header">
			<Space>
				<CaretDownOutlined
					@click="handleOpenChange"
					:style="rotate"
					style="
						margin-left: 12px;
						cursor: pointer;
						transition: transform 0.3s ease;
					"
				/>
				<Checkbox
					v-model:checked="checkAll"
					:indeterminate="indeterminate"
					@change="onCheckAllChange"
				></Checkbox>
				<span class="title">{{ title }}</span>
			</Space>
		</div>
		<div v-show="open">
			<CheckboxGroup
				@change="onChangeCheck"
				style="width: 100%"
				v-model:value="checkedList"
			>
				<Row style="margin: 8px 34px">
					<Col
						style="margin-bottom: 12px"
						:span="6"
						v-for="item in data"
						:key="item.value"
					>
						<Checkbox :value="item.value">{{ item.label }}</Checkbox>
					</Col>
				</Row>
			</CheckboxGroup>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { CaretDownOutlined } from '@ant-design/icons-vue';
import { Checkbox, Space, Row, Col, CheckboxGroup } from 'ant-design-vue';
import { computed, PropType, ref, watch } from 'vue';

const props = defineProps({
	title: String,
	data: {
		type: Array as PropType<
			Array<{
				label: string;
				value: string;
			}>
		>,
		default: () => [],
	},
	checkedKeys: {
		type: Array as PropType<string[]>,
		default: () => [],
	},
});

const emit = defineEmits(['update:checkedKeys']);

const indeterminate = ref(false);

const checkAll = ref(false);

const checkedList = ref<string[]>([...props.checkedKeys]);

const rotation = ref(0);

const open = ref(true);

const rotate: any = computed(() => ({
	transform: `rotate(${rotation.value}deg)`,
}));

const handleOpenChange = () => {
	rotation.value = open.value ? -90 : 0;
	open.value = !open.value;
};

watch(props.checkedKeys, () => {
	checkedList.value = [...props.checkedKeys];
});

watch(
	checkedList,
	(val) => {
		if (val.length === 0) {
			indeterminate.value = false;
			checkAll.value = false;
		} else if (val.length === props.data.length) {
			indeterminate.value = false;
			checkAll.value = true;
		} else {
			indeterminate.value = true;
			checkAll.value = false;
		}
	},
	{
		immediate: true,
	}
);

function onChangeCheck() {
	emit('update:checkedKeys', checkedList.value);
}

const onCheckAllChange = (e: any) => {
	checkedList.value = e.target.checked
		? props.data?.map((item) => item.value)
		: [];
	indeterminate.value = false;
	emit('update:checkedKeys', checkedList.value);
};
</script>
