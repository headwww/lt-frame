import { IPublicTypeFieldConfig, ISettingField } from '@lt-frame/components';
import {
	VxeTablePropTypes,
	VxeTableDefines,
	VxeColumnPropTypes,
} from 'vxe-table';

export interface AjaxConfig {
	url: string;
	targetClass: string;
	columns: Array<Column>;
}

export interface Column {
	field: string;
	title: string;
	type: string;
	width: number | string;
	fixed: VxeColumnPropTypes.Fixed;
	sortable: boolean;
	dataFormatter: string;
	numberFormatter: number;
	enumFormatter: {
		key: string;
		value: string | number | boolean;
	}[];
	editRules: VxeTableDefines.ValidatorRule;
	// 编辑和筛选时候type是实体的话需要配置的数据源配置
	extraDataSources: AjaxConfig;
}

/**
 * 设置器产出的对象
 */
export interface TableFields {
	// 列的配置
	columns: Array<Column>;
	// 高级
	seq: boolean;
	radio: boolean;
	checkbox: boolean;

	// 全局配置
	stripe: boolean;
	size: string;
	align: string;
	showOverflow: boolean;
	// 列配置
	columnConfig: VxeTablePropTypes.ColumnConfig;
	// 编辑配置
	editConfig: VxeTablePropTypes.EditConfig;
}

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
									isRequired: true,
									setter: {
										componentName: 'StringSetter',
										props: {
											placeholder: '必填项',
										},
									},
								},
								{
									title: '数据类型',
									name: 'type',
									defaultValue: {
										label: '文本',
										value: 'text',
									},
									setter: {
										componentName: 'SelectSetter',
										props: {
											options: [
												{
													label: '文本',
													value: 'text',
												},
												{
													label: '数字',
													value: 'number',
												},
												{
													label: '日期',
													value: 'data',
												},
												{
													label: '枚举',
													value: 'enum',
												},
												{
													label: '实体',
													value: 'entity',
												},
											],
										},
										initialValue: 'text',
									},
								},
								{
									name: 'width',
									title: '列宽',
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
									name: 'sortable',
									title: '排序',
									setter: 'BoolSetter',
								},
								{
									name: 'dataFormatter',
									title: '时间格式',
									condition: (target: ISettingField) =>
										target
											.getProps()
											.getPropValue(
												target.path.slice(0, -1).concat('type').join('.')
											) === 'data',
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
									name: 'numberFormatter',
									title: '小数位',
									condition: (target: ISettingField) =>
										target
											.getProps()
											.getPropValue(
												target.path.slice(0, -1).concat('type').join('.')
											) === 'number',
									setter: 'NumberSetter',
								},
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
