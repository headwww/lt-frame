import { VxeTablePropTypes, VxeColumnPropTypes } from 'vxe-table';
import { Recordable } from '@lt-frame/utils';
import { isArray } from 'lodash-es';
import { IPublicTypeFieldConfig, ISettingField } from '../../../lowcode-engine';

export interface AjaxConfig {
	url: string;
	targetClass: string;
	columns: Array<Column>;
}

export interface Column {
	field?: Recordable;
	title?: string;
	type?: string;
	parentType?: string;
	width?: number | string;
	fixed?: VxeColumnPropTypes.Fixed;
	dataProps?: boolean;
	sortable?: boolean;
	json?: Array<{
		required?: boolean;
		min?: number;
		max?: number;
		pattern?: string;
		message?: string;
	}>;

	dataFormatter?: string;
	numberFormatter?: number;
}

/**
 * 设置器产出的对象
 */
export interface TableFields {
	// 列的配置
	columns?: Array<Column>;
	// 高级
	seq?: boolean;
	radio?: boolean;
	checkbox?: boolean;

	// 全局配置
	stripe?: boolean;
	size?: string;
	align?: string;
	showOverflow?: boolean;
	// 列配置
	columnConfig?: VxeTablePropTypes.ColumnConfig;
	// 编辑配置
	editConfig?: VxeTablePropTypes.EditConfig;
}

const childrenColumn: IPublicTypeFieldConfig = {
	name: 'entity',
	display: 'accordion',
	condition: (target: ISettingField) => {
		const parentType = target
			.getProps()
			.getPropValue(target.path.slice(0, -1).concat('parentType').join('.'));
		if (parentType) {
			return true;
		}

		return false;
	},
	title: {
		label: '实体配置',
		tip: '配置编辑模式和筛选器需要的实体',
	},
	setter: {
		componentName: 'ArraySetter',
		props: {
			itemSetter: {
				componentName: 'ObjectSetter',
				props: {
					config: {
						items: [
							{
								name: 'title',
								isRequired: true,
								title: '标题',
								defaultValue: '标题',
								setter: 'StringSetter',
							},
							{
								name: 'width',
								title: '列宽',
								isRequired: true,
								defaultValue: 200,
								setter: 'NumberSetter',
							},
							{
								name: 'field',
								title: '数据字段',
								setter: {
									componentName: 'FieldSetter',
								},
							},
						] as IPublicTypeFieldConfig[],
					},
				},
			},
		},
	},
};

export const schemas: IPublicTypeFieldConfig[] = [
	// 数据列
	{
		name: 'columns',
		display: 'accordion',
		title: '数据列',
		setter: {
			componentName: 'ArraySetter',
			props: {
				itemSetter: {
					componentName: 'ObjectSetter',
					props: {
						config: {
							items: [
								{
									name: 'title',
									isRequired: true,
									title: '标题',
									defaultValue: '标题',
									setter: 'StringSetter',
								},
								{
									name: 'field',
									title: '数据字段',
									setValue(target: ISettingField, value: any) {
										target
											.getProps()
											.setPropValue(
												target.path.slice(0, -1).concat('type').join('.'),
												value.fieldType
											);
										target
											.getProps()
											.setPropValue(
												target.path.slice(0, -1).concat('parentType').join('.'),
												value.parentType
											);
										target
											.getProps()
											.setPropValue(
												target.path.slice(0, -1).concat('title').join('.'),
												value.fieldCommnet
											);
									},
									setter: {
										componentName: 'FieldSetter',
										props: {
											path: 'lt.app.logistics.model.AdjustStoreLine',
										},
									},
								},
								{
									title: {
										label: '父级实体',
									},
									name: 'parentType',
									setter: 'TextSetter',
								},
								{
									title: '数据类型',
									name: 'type',
									setter: 'TextSetter',
								},
								{
									title: {
										label: '开启时分秒',
										tip: '编辑和筛选的时间选择器是否支持时分秒选择',
									},
									name: 'dataProps',
									condition: (target: ISettingField) => {
										const parentType = target
											.getProps()
											.getPropValue(
												target.path.slice(0, -1).concat('parentType').join('.')
											);
										const type = target
											.getProps()
											.getPropValue(
												target.path.slice(0, -1).concat('type').join('.')
											);
										if (!parentType && type === 'java.util.Date') {
											return true;
										}

										return false;
									},
									setter: 'BoolSetter',
								},
								{
									name: 'width',
									title: '列宽',
									isRequired: true,
									defaultValue: 200,
									setter: 'NumberSetter',
								},
								{
									name: 'fixed',
									title: '列固定',
									defaultValue: '',
									setter: {
										componentName: 'RadioGroupSetter',
										props: {
											options: [
												{
													label: '左侧',
													value: 'left',
												},
												{
													label: '不锁',
													value: '',
												},
												{
													label: '右侧',
													value: 'right',
												},
											],
										},
									},
								},
								{
									name: 'numberFormatter',
									title: '小数位',
									condition: (target: ISettingField) => {
										const type = target
											.getProps()
											.getPropValue(
												target.path.slice(0, -1).concat('type').join('.')
											);
										if (
											type === 'java.lang.Integer' ||
											type === 'java.lang.Long' ||
											type === 'java.math.BigDecimal'
										) {
											return true;
										}

										return false;
									},
									setter: {
										componentName: 'NumberSetter',
										props: {
											min: 0,
										},
									},
								},
								{
									name: 'dataFormatter',
									title: '时间格式',
									condition: (target: ISettingField) =>
										target
											.getProps()
											.getPropValue(
												target.path.slice(0, -1).concat('type').join('.')
											) === 'java.util.Date',
									setter: {
										componentName: 'SelectSetter',
										props: {
											options: [
												{
													label: 'YYYY年MM月DD日 HH时mm分ss秒',
													value: 'YYYY年MM月DD日 HH时mm分ss秒',
												},
												{
													label: 'YYYY年MM月DD日 HH时mm分',
													value: 'YYYY年MM月DD日 HH时mm分',
												},
												{
													label: 'YYYY年MM月DD日',
													value: 'YYYY年MM月DD日',
												},
												{
													label: 'YYYY年MM月',
													value: 'YYYY年MM月',
												},
												{
													label: 'YYYY年',
													value: 'YYYY年',
												},
												{
													label: 'YYYY-MM-DD HH:mm:ss',
													value: 'YYYY-MM-DD HH:mm:ss',
												},
												{
													label: 'YYYY-MM-DD HH:mm',
													value: 'YYYY-MM-DD HH:mm',
												},
												{
													label: 'YYYY-MM-DD',
													value: 'YYYY-MM-DD',
												},
												{
													label: 'YYYY-MM',
													value: 'YYYY-MM',
												},
												{
													label: 'YYYY',
													value: 'YYYY',
												},
											],
										},
									},
								},
								{
									name: 'json',
									title: '编辑规则',
									setter: {
										componentName: 'JsonSetter',
										props: {
											validate: (json: any) => {
												if (isArray(json)) {
													return true;
												}
												return false;
											},
											document: [
												{
													type: 'title',
													content: '用法',
												},
												{
													type: 'paragraph',
													content:
														'给列设置编辑校验规则，通过设置左侧json的方式来设置，提供了如下配置：',
												},
												{
													type: 'paragraph',
													content: `required：'是否必填(true、false)'`,
												},
												{
													type: 'paragraph',
													content: `min：校验值最小长度（如果 type=number 则比较值大小）`,
												},
												{
													type: 'paragraph',
													content: `max：校验值最大长度（如果 type=number 则比较值大小）`,
												},
												{
													type: 'paragraph',
													content: `pattern：正则校验`,
												},
												{
													type: 'paragraph',
													content: `message：校验提示内容`,
												},
												{
													type: 'title',
													content: '模版',
												},
												{
													type: 'paragraph',
													content: `"required":true`,
													copyable: true,
												},
												{
													type: 'paragraph',
													content: `"required":false`,
													copyable: true,
												},
												{
													type: 'paragraph',
													content: `"type":"number"`,
													copyable: true,
												},
												{
													type: 'paragraph',
													content: `"min":0`,
													copyable: true,
												},
												{
													type: 'paragraph',
													content: `"max":99`,
													copyable: true,
												},
												{
													type: 'paragraph',
													content: `"message":"必填项"`,
													copyable: true,
												},
											],
										},
									},
								},
								childrenColumn,
							] as IPublicTypeFieldConfig[],
						},
					},
				},
			},
		},
	},
	// 高级配置
	{
		type: 'group',
		name: 'senior',
		display: 'accordion',
		title: '高级配置',
		items: [
			{
				type: 'field',
				name: 'seq',
				title: '开启序号列',
				defaultValue: true,
				setter: 'BoolSetter',
			},
			{
				type: 'field',
				name: 'radio',
				title: '开启单选列',
				setter: 'BoolSetter',
			},
			{
				type: 'field',
				name: 'checkbox',
				title: '开启多选列',
				defaultValue: true,
				setter: 'BoolSetter',
			},
		],
	},
	// 全局样式
	{
		type: 'group',
		name: 'globalStyle',
		display: 'accordion',
		title: '全局样式',
		items: [
			{
				type: 'field',
				name: 'stripe',
				title: {
					label: '斑马线',
					tip: '树表格自动关闭斑马线',
				},
				defaultValue: true,
				setter: 'BoolSetter',
			},
			{
				type: 'field',
				name: 'size',
				title: '尺寸',
				defaultValue: 'medium',
				setter: {
					componentName: 'RadioGroupSetter',
					props: {
						options: [
							{
								label: '默认',
								value: 'medium',
							},
							{
								label: '紧凑',
								value: 'small',
							},
							{
								label: '迷你',
								value: 'mini',
							},
						],
					},
				},
			},
			{
				type: 'field',
				name: 'align',
				title: '对齐方式',
				defaultValue: 'center',
				setter: {
					componentName: 'RadioGroupSetter',
					props: {
						options: [
							{
								label: '靠左',
								value: 'left',
							},
							{
								label: '居中',
								value: 'center',
							},
							{
								label: '靠右',
								value: 'right',
							},
						],
					},
				},
			},
			{
				type: 'field',
				name: 'showOverflow',
				title: {
					tip: '当内容过长时显示为省略号,开启则是省略显示',
					label: '显示方式',
				},
				defaultValue: true,
				setter: 'BoolSetter',
			},
		],
	},
];
