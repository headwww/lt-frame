import { Column } from './types';
import { FieldConfig } from './types/field';
import { SetterConfig } from './types/setter';

export const gridSchema: FieldConfig[] = [
	{
		type: 'field',
		name: 'columns',
		title: '数据列',
		display: 'accordion',
		setter: {
			// 子节点只能设置ObjectSetter
			componentName: 'ArraySetter',
			props: {
				itemSetter: {
					componentName: 'ObjectSetter',
					props: {
						config: [
							{
								type: 'field',
								name: 'type',
								title: '数据类型',
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
								name: 'title',
								title: '标题',
								isRequired: true,
								setter: 'StringSetter',
							},
							{
								name: 'field',
								title: '数据字段',
								isRequired: true,
								setter: {
									componentName: 'StringSetter',
								},
							},
							{
								name: 'width',
								title: '列宽',
								setter: 'NumberSetter',
							},
							{
								name: 'fixed',
								title: '列固定',
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
								condition: (tager: Column) => tager.type === 'data',
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
								condition: (tager: Column) => tager.type === 'number',
								setter: 'NumberSetter',
							},
							{
								name: 'enumFormatter',
								title: '枚举',
								condition: (tager: Column) => tager.type === 'enum',
								setter: {
									componentName: 'ArraySetter',
									props: {
										edit: false,
										drag: false,
										itemSetter: {
											componentName: 'ObjectSetter',
											props: {
												config: [
													{
														name: 'key',
														title: '键',
														isRequired: true,
														setter: {
															componentName: 'StringSetter',
															props: {
																placeholder: '键',
															},
														},
													},
													{
														name: 'value',
														title: '值',
														isRequired: true,
														setter: {
															componentName: 'StringSetter',
															props: {
																placeholder: '值',
															},
														},
													},
												],
											},
										},
									},
								},
							},
							{
								name: 'extraDataSources',
								title: '额外数据源',
								display: 'accordion',
								condition: (tager: Column) => tager.type === 'entity',
								setter: {
									componentName: 'ObjectSetter',
									props: {
										config: [
											{
												name: 'url',
												title: '请求地址',
												setter: 'StringSetter',
											},
											{
												name: 'targetClass',
												title: '实体路径',
												setter: 'StringSetter',
											},
											{
												type: 'field',
												name: 'columns',
												title: '列配置',
												setter: {
													// 子节点只能设置ObjectSetter
													componentName: 'ArraySetter',
													props: {
														itemSetter: {
															componentName: 'ObjectSetter',
															props: {
																config: [
																	{
																		name: 'title',
																		title: '标题',
																		isRequired: true,
																		setter: 'StringSetter',
																	},
																	{
																		name: 'field',
																		title: '数据字段',
																		isRequired: true,
																		setter: {
																			componentName: 'StringSetter',
																		},
																	},
																],
															},
														},
													},
												},
											},
										],
									},
								},
							},
						] as Array<FieldConfig>,
					},
				} as SetterConfig,
			},
		},
	},
	{
		type: 'group',
		name: 'globalStyle',
		title: '全局样式',
		display: 'accordion',
		items: [
			{
				type: 'field',
				name: 'stripe',
				title: {
					label: '斑马线',
					tip: '在可编辑表格场景下，临时插入的数据不会有斑马纹样式,在树表格模式下改设置请关闭',
				},
				initialValue: true,
				setter: 'BoolSetter',
			},
			{
				type: 'field',
				name: 'round',
				title: '圆角边框',
				initialValue: true,
				setter: {
					componentName: 'BoolSetter',
				},
			},
			{
				type: 'field',
				name: 'border',
				title: '边框',
				setter: {
					componentName: 'SelectSetter',
					props: {
						options: [
							{
								label: '默认',
								value: 'default',
							},
							{
								label: '完整边框',
								value: 'full',
							},
							{
								label: '外边框',
								value: 'outer',
							},
							{
								label: '内边框',
								value: 'inner',
							},
							{
								label: '无边框',
								value: 'none',
							},
						],
					},
					initialValue: 'default',
				},
			},
			{
				type: 'field',
				name: 'size',
				title: '表格尺寸',
				setter: {
					componentName: 'RadioGroupSetter',
					initialValue: 'medium',
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
				name: 'showOverflow',
				title: '省略显示',
				initialValue: true,
				setter: 'BoolSetter',
			},
			{
				type: 'field',
				name: 'align',
				title: {
					label: '对齐方式',
					tip: '作用于整个表格的,所有的列对齐方式',
				},
				setter: {
					componentName: 'RadioGroupSetter',
					initialValue: 'center',
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
		],
	},
	{
		type: 'group',
		name: 'seiner',
		title: '高级',
		display: 'accordion',
		items: [
			{
				type: 'field',
				name: 'seqColunms',
				title: '开启序号列',
				initialValue: true,
				setter: {
					componentName: 'BoolSetter',
				},
			},
			{
				type: 'field',
				name: 'radioColunms',
				title: '开启单选列',
				setter: {
					initialValue: false,
					componentName: 'BoolSetter',
				},
			},
			{
				type: 'field',
				name: 'checkboxColunms',
				title: '开启多选列',
				setter: {
					initialValue: false,
					componentName: 'BoolSetter',
				},
			},
		],
	},
];
