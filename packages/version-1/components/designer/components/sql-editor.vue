<template>
	<div style="height: 100%">
		<div style="height: 450px; overflow: scroll scroll; padding: 8px">
			<ConditionEditor
				@delete="onDelete"
				@add="onAdd"
				v-model:conditionExpr="conditionExpr"
			>
				<template #item="item">
					<TreeSelect
						:value="get(item, 'params.field.id')"
						:key="item.id"
						:treeData="treeData"
						:load-data="onLoadData"
						:tree-line="true && { showLeafIcon: false }"
						tree-data-simple-mode
						style="width: 208px"
						:dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
						treeNodeLabelProp="value"
						@dropdownVisibleChange="dropdownVisibleChange"
						@select="
							(v: any) => {
								onParamsSelect(item, v);
							}
						"
					></TreeSelect>
					<Select
						v-if="get(item, 'params.field')"
						:value="get(item, 'params.operator')"
						@select="
							(v: any) => {
								onOperatorSelect(item, v);
							}
						"
						:options="getLogicalSymbols(item.params.field)"
						style="margin-left: 15px; width: 100px"
					></Select>
					<component
						v-if="get(item, 'params.field')"
						style="margin-left: 15px; width: 280px"
						v-bind="{ ...getComponent(item)?.bind }"
						:is="getComponent(item)?.com"
					></component>
					<Checkbox
						v-if="get(item, 'params.field')"
						:checked="get(item, 'params.not')"
						@update:checked="
							(v: any) => {
								onCheck(item, v);
							}
						"
						style="margin-left: 15px; width: 60px"
						>取反</Checkbox
					>
				</template>
			</ConditionEditor>
		</div>

		<div style="height: 100%">
			<Codemirror
				v-model="code"
				disabled
				:style="{ height: '100%' }"
				:extensions="[sql()]"
			>
			</Codemirror>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ConditionEditor, ConditionExpr } from '@lt-frame/components';
import { LtHttp } from '@lt-frame/version-1';
import {
	Select,
	TreeSelect,
	Checkbox,
	TreeSelectProps,
	SelectProps,
	Input,
	InputNumber,
	Switch,
} from 'ant-design-vue';
import { sql } from '@codemirror/lang-sql';
import { get, omit, uniqueId } from 'lodash-es';
import { ComponentOptions, onMounted, PropType, ref, watch } from 'vue';
import { mapTree } from 'xe-utils';
import { Codemirror } from 'vue-codemirror';
import InputGroup from './input-group.vue';
import InputNumberGroup from './input-number-group.vue';
import DatePickerMode from './date-picker-mode.vue';
import DatePickerModeGroup from './date-picker-mode-group.vue';
import { generateHqlWhereClause } from './util';

const props = defineProps({
	value: {
		type: Array as PropType<Array<ConditionExpr>>,
		default: () => [],
	},
	entity: String,
});

const emit = defineEmits(['update:value']);

const conditionExpr = ref<ConditionExpr[]>(props.value);

function onDelete(params: ConditionExpr) {
	removeItemById(conditionExpr.value, params.id);
}

function onAdd(params: { item: ConditionExpr; type: any }) {
	mapTree(conditionExpr.value, (item) => {
		if (item.id === params.item.id) {
			if (params.type === 'group') {
				const id = `${item.id}_${uniqueId()}`;
				item.children?.push({
					id,
					parentId: item.id,
					type: params.type,
					children: [
						{
							id: `${id}_${uniqueId()}`,
							parentId: id,
							type: 'single',
						},
					],
				});
			} else {
				item.children?.push({
					id: `${item.id}_${uniqueId()}`,
					parentId: item.id,
					type: params.type,
				});
			}
		}
		return item;
	});
}

function removeItemById(array: any, idToRemove: any) {
	return array.reduce((accumulator: any, item: any) => {
		if (item.type === 'group' && item.children) {
			item.children = removeItemById(item.children, idToRemove);
		}
		if (item.id !== idToRemove) {
			accumulator.push(item);
		}
		return accumulator;
	}, []);
}

function getComponent(item: ConditionExpr): {
	com?: ComponentOptions;
	bind?: {
		[key: string]: any;
	};
} | null {
	if (get(item, 'params.field.fieldTypeFlag') === '2') {
		return {
			com: Select as ComponentOptions,
			bind: {
				value: item?.params?.value,
				options: get(item, 'params.field.enumInfo').map((item: any) => ({
					label: item.value,
					value: item.key,
				})),
				'onUpdate:value': (value: any) => {
					const arr = mapTree(conditionExpr.value, (i) => {
						if (item.id === i.id) {
							return {
								...i,
								params: {
									...i.params,
									value,
								},
							};
						}
						return i;
					});
					conditionExpr.value = arr;
				},
			},
		};
	}
	if (get(item, 'params.field.fieldType') === 'java.lang.Boolean') {
		return {
			com: Switch as ComponentOptions,
			bind: {
				style: {
					width: '44px',
				},
				checked: item?.params?.value,
				'onUpdate:checked': (value: any) => {
					const arr = mapTree(conditionExpr.value, (i) => {
						if (item.id === i.id) {
							return {
								...i,
								params: {
									...i.params,
									value,
								},
							};
						}
						return i;
					});
					conditionExpr.value = arr;
				},
			},
		};
	}
	if (get(item, 'params.field.fieldType') === 'java.lang.String') {
		const bind = {
			value: item?.params?.value,
			'onUpdate:value': (value: any) => {
				const arr = mapTree(conditionExpr.value, (i) => {
					if (item.id === i.id) {
						return {
							...i,
							params: {
								...i.params,
								value,
							},
						};
					}
					return i;
				});
				conditionExpr.value = arr;
			},
		};
		return {
			com: (get(item, 'params.operator') === '起止'
				? InputGroup
				: Input) as ComponentOptions,
			bind,
		};
	}
	if (
		get(item, 'params.field.fieldType') === 'java.lang.Integer' ||
		get(item, 'params.field.fieldType') === 'java.lang.Long' ||
		get(item, 'params.field.fieldType') === 'java.math.BigDecimal'
	) {
		const bind = {
			value: item?.params?.value,
			'onUpdate:value': (value: any) => {
				const arr = mapTree(conditionExpr.value, (i) => {
					if (item.id === i.id) {
						return {
							...i,
							params: {
								...i.params,
								value,
							},
						};
					}
					return i;
				});
				conditionExpr.value = arr;
			},
		};
		return {
			com: (get(item, 'params.operator') === '起止'
				? InputNumberGroup
				: InputNumber) as ComponentOptions,
			bind,
		};
	}
	if (get(item, 'params.field.fieldType') === 'java.util.Date') {
		const bind: { [key: string]: any } = {
			style: {
				width: '444px',
			},
			value: item?.params?.value,
			type: item?.expr?.type,
			'onUpdate:value': (value: any) => {
				const arr = mapTree(conditionExpr.value, (i) => {
					if (item.id === i.id) {
						return {
							...i,
							params: {
								...i.params,
								value,
							},
						};
					}
					return i;
				});
				conditionExpr.value = arr;
			},
			'onUpdate:type': (value: any) => {
				const arr = mapTree(conditionExpr.value, (i) => {
					if (item.id === i.id) {
						return {
							...i,
							expr: {
								type: value,
							},
						};
					}
					return i;
				});
				conditionExpr.value = arr;
			},
		};

		if (get(item, 'params.operator') === '预设') {
			bind.options = [
				{ label: '当天', value: '当天' },
				{ label: '近两天', value: '近两天' },
				{ label: '近三天', value: '近三天' },
				{ label: '本周', value: '本周' },
				{ label: '一周内', value: '一周内' },
				{ label: '本月', value: '本月' },
				{ label: '一月内', value: '一月内' },
			];
		}

		return {
			com:
				get(item, 'params.operator') === '预设'
					? (Select as ComponentOptions)
					: ((get(item, 'params.operator') === '起止'
							? DatePickerModeGroup
							: DatePickerMode) as ComponentOptions),
			bind,
		};
	}

	return null;
}

const treeData = ref<TreeSelectProps['treeData']>([]);

const onParamsSelect = (item: ConditionExpr, v: any) => {
	const find: any = treeData.value?.find((item) => item.id === v);
	mapTree(conditionExpr.value, (i) => {
		if (item.id === i.id) {
			return {
				...i,
				params: {
					field: find,
				},
			};
		}
		return i;
	});
};

const onCheck = (item: ConditionExpr, v: any) => {
	mapTree(conditionExpr.value, (i) => {
		if (item.id === i.id) {
			return {
				...i,
				params: {
					...i.params,
					not: v,
				},
			};
		}
		return i;
	});
};

const onOperatorSelect = (item: ConditionExpr, v: any) => {
	mapTree(conditionExpr.value, (i) => {
		if (item.id === i.id) {
			return {
				...i,
				params: {
					...omit(i.params, 'value'),
					operator: v,
				},
			};
		}
		return i;
	});
};

function postLoad(className: string) {
	return LtHttp.post({
		url: 'api/testServiceImpl/getFieldListByClass',
		data: [
			[
				{
					className,
				},
			],
		],
	});
}

const onLoadData = (treeNode: any) =>
	new Promise((resolve) => {
		postLoad(treeNode.fieldType).then((data) => {
			const tree = data.map((item: any) => {
				const id = treeNode.id.concat('.').concat(item.fieldName);
				return {
					id,
					value: id,
					pId: treeNode.dataRef.id,
					title: `${item.fieldName}  (${item.fieldCommnet})`,
					fieldType: item.fieldType,
					isLeaf: item.fieldTypeFlag !== '1',
					disabled: item.fieldTypeFlag === '1',
					fieldTypeFlag: item.fieldTypeFlag,
					fieldName: id,
					enumInfo: item.enumInfo,
				};
			});
			treeData.value = treeData.value?.concat(tree);
			resolve(true);
		});
	});

function dropdownVisibleChange() {
	treeData.value = [];
	postLoad(props.entity!!).then((data: any) => {
		treeData.value = [
			...data.map((item: any) => ({
				id: item.fieldName,
				pId: 0,
				value: item.fieldName,
				title: `${item.fieldName}  (${item.fieldCommnet})`,
				isLeaf: item.fieldTypeFlag !== '1',
				disabled: item.fieldTypeFlag === '1',
				fieldType: item.fieldType,
				fieldTypeFlag: item.fieldTypeFlag,
				enumInfo: item.enumInfo,
			})),
		];
	});
}

/**
 枚举: 等于 为空
 数字: 等于 小于 小于等于 大于 大于等于 起止 为空
 日期: 等于 小于 小于等于 大于 大于等于 起止 预设 为空
 字符: 等于 开头匹配 末尾匹配 包含 起止 为空
 */
function getLogicalSymbols(params: any): SelectProps['options'] {
	if (
		params.fieldTypeFlag === '2' ||
		params.fieldType === 'java.lang.Boolean'
	) {
		return [
			{ value: '等于', label: '等于' },
			{ value: '为空', label: '为空' },
		];
	}
	if (
		params.fieldType === 'java.lang.Integer' ||
		params.fieldType === 'java.lang.Long' ||
		params.fieldType === 'java.math.BigDecimal'
	) {
		return [
			{ value: '等于', label: '等于' },
			{ value: '小于', label: '小于' },
			{ value: '小于等于', label: '小于等于' },
			{ value: '大于', label: '大于' },
			{ value: '大于等于', label: '大于等于' },
			{ value: '起止', label: '起止' },
			{ value: '为空', label: '为空' },
		];
	}
	if (params.fieldType === 'java.util.Date') {
		return [
			{ value: '等于', label: '等于' },
			{ value: '小于', label: '小于' },
			{ value: '小于等于', label: '小于等于' },
			{ value: '大于', label: '大于' },
			{ value: '大于等于', label: '大于等于' },
			{ value: '起止', label: '起止' },
			{ value: '预设', label: '预设' },
			{ value: '为空', label: '为空' },
		];
	}
	if (params.fieldType === 'java.lang.String') {
		return [
			{ value: '等于', label: '等于' },
			{ value: '开头匹配', label: '开头匹配' },
			{ value: '末尾匹配', label: '末尾匹配' },
			{ value: '包含', label: '包含' },
			{ value: '起止', label: '起止' },
			{ value: '为空', label: '为空' },
		];
	}
}

const code = ref();
let isUpdate = true;
watch(
	() => props.value,
	() => {
		isUpdate = false;
		conditionExpr.value = props.value;
		code.value = generateHqlWhereClause(conditionExpr.value[0]);
	}
);

watch(
	() => conditionExpr.value,
	() => {
		if (isUpdate) {
			emit('update:value', conditionExpr.value);
			code.value = generateHqlWhereClause(conditionExpr.value[0]);
		}
		isUpdate = true;
	},
	{
		deep: true,
	}
);

onMounted(() => {
	code.value = generateHqlWhereClause(conditionExpr.value[0]);
});
</script>
