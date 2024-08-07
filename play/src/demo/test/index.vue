<template>
	<div style="background-color: white; padding: 20px">
		<Codemirror
			v-model="code"
			disabled
			:style="{ height: '80px' }"
			:extensions="[sql()]"
		>
		</Codemirror>

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
					style="margin-left: 15px"
					>取反</Checkbox
				>
			</template>
		</ConditionEditor>
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
import { ComponentOptions, ref, watch } from 'vue';
import { mapTree } from 'xe-utils';
import { Codemirror } from 'vue-codemirror';
import dayjs from 'dayjs';
import InputGroup from './input-group.vue';
import InputNumberGroup from './input-number-group.vue';
import DatePickerMode from './date-picker-mode.vue';
import DatePickerModeGroup from './date-picker-mode-group.vue';

const conditionExpr = ref<ConditionExpr[]>([
	{
		id: '1',
		type: 'group',
		children: [
			{
				id: '1-1',
				parentId: '1',
				type: 'single',
			},
		],
	},
]);

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
	postLoad('lt.app.productresource.model.Equipment').then((data: any) => {
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

watch(
	() => conditionExpr.value,
	() => {
		code.value = generateHqlWhereClause(conditionExpr.value[0]);
	},
	{
		deep: true,
	}
);

function generateHqlWhereClause(node: ConditionExpr): string {
	if (node.type === 'single') {
		return processSingleNode(node);
	}
	if (node.type === 'group' && node.children) {
		const conditionType = node.conditionType || 'AND';
		const clauses = node.children.map((child) => generateHqlWhereClause(child));
		return `${clauses.join(` ${conditionType} `)}`;
	}
	return '';
}

function processSingleNode(node: ConditionExpr): string {
	if (!node.params) return '';

	const { field, operator, value, not } = node.params;
	let clause: string = '';

	const v =
		get(node, 'params.field.fieldType') === 'java.lang.Boolean' ||
		get(node, 'params.field.fieldType') === 'java.lang.Integer' ||
		get(node, 'params.field.fieldType') === 'java.lang.Long' ||
		get(node, 'params.field.fieldType') === 'java.math.BigDecimal'
			? value
			: `'${value}'`;

	switch (operator) {
		case '等于':
			clause =
				value === null
					? `this.${field.value} IS NULL`
					: `this.${field.value} = ${v}`;
			break;
		case '小于':
			clause = `this.${field.value} < ${v}`;
			break;
		case '小于等于':
			clause = `this.${field.value} <= ${v}`;
			break;
		case '大于':
			clause = `this.${field.value} > ${v}`;
			break;
		case '大于等于':
			clause = `this.${field.value} >= ${v}`;
			break;
		case '起止':
			if (
				get(node, 'params.field.fieldType') === 'java.lang.Boolean' ||
				get(node, 'params.field.fieldType') === 'java.lang.Integer' ||
				get(node, 'params.field.fieldType') === 'java.lang.Long' ||
				get(node, 'params.field.fieldType') === 'java.math.BigDecimal'
			) {
				clause = `(this.${field.value} BETWEEN ${get(value, '0')} AND ${get(
					value,
					'1'
				)})`;
			} else {
				clause = `(this.${field.value} BETWEEN '${get(value, '0')}' AND '${get(
					value,
					'1'
				)}')`;
			}

			break;
		case '开头匹配':
			clause = `this.${field.value} LIKE '${value}%'`;
			break;
		case '末尾匹配':
			clause = `this.${field.value} LIKE '%${value}'`;
			break;
		case '包含':
			clause = `this.${field.value} LIKE '%${value}%'`;
			break;
		case '预设':
			switch (value) {
				case '当天':
					clause = `this.${field.value} = CURRENT_DATE`;
					break;
				case '本周':
					clause = `YEARWEEK(this.${field.value}, 1) = YEARWEEK(CURRENT_DATE, 1)`;
					break;
				case '本月':
					clause = `YEAR(this.${field.value}) = YEAR(CURRENT_DATE) AND MONTH(this.${field.value}) = MONTH(CURRENT_DATE)`;
					break;
				case '近两天':
				case '近三天':
				case '一周内':
				case '一月内':
					const presetDate = getPresetDate(value);
					clause = `this.${field.value} >= '${presetDate}'`;
					break;
				default:
					throw new Error(`Unknown preset value: ${value}`);
			}
			break;
		case '为空':
			clause = `this.${field.value} IS NULL`;
			break;
		default:
			clause = `this.${field.value} ${operator} ${v}`;
			break;
	}

	if (not) {
		clause = `NOT (${clause})`;
	}

	return clause;
}

function getPresetDate(value: string): Date {
	const today = dayjs();
	let date: dayjs.Dayjs;

	switch (value) {
		case '当天':
			date = today;
			break;
		case '近两天':
			date = today.subtract(1, 'day');
			break;
		case '近三天':
			date = today.subtract(2, 'day');
			break;
		case '本周':
			date = today.startOf('week');
			break;
		case '一周内':
			date = today.subtract(6, 'day');
			break;
		case '本月':
			date = today.startOf('month');
			break;
		case '一月内':
			date = today.subtract(30, 'day');
			break;
		default:
			throw new Error(`Unknown preset value: ${value}`);
	}

	return date.toDate();
}
</script>
