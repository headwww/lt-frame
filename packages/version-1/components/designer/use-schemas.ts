import { IPublicTypeFieldConfig, ISettingField } from '@lt-frame/components';
import { isArray, isUndefined, uniqueId } from 'lodash-es';
import { ref } from 'vue';

export function useSchemas() {
	const schemas = ref<IPublicTypeFieldConfig[]>([]);

	const childrenColumn: IPublicTypeFieldConfig = {
		name: 'entityColumn',
		display: 'plain',
		title: {
			label: '列配置',
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
										props: {
											setterPath: 'entityPath',
										},
									},
									setValue(target: ISettingField, value: any) {
										const path = target.path.slice(0, -1);
										target
											.getProps()
											.setPropValue(
												path.concat('type').join('.'),
												value.fieldType
											);
										target
											.getProps()
											.setPropValue(
												path.concat('parentType').join('.'),
												value.parentType
											);
										target
											.getProps()
											.setPropValue(
												path.concat('title').join('.'),
												value.fieldCommnet
											);
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
							] as IPublicTypeFieldConfig[],
						},
					},
				},
			},
		},
	};

	function buildSchemas(entity?: string, options?: any[], datasource?: any[]) {
		// 数据列
		schemas.value.push({
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
										title: {
											label: '数据字段',
											tip: '当数据字段更改时，代表着数据类型变化了，需要重新配置实体配置，小数位配置，日期格式配置',
										},
										setValue(target: ISettingField, value: any) {
											const path = target.path.slice(0, -1);
											target
												.getProps()
												.setPropValue(
													path.concat('type').join('.'),
													value.fieldType
												);
											target
												.getProps()
												.setPropValue(
													path.concat('parentType').join('.'),
													value.parentType
												);
											target
												.getProps()
												.setPropValue(
													path.concat('title').join('.'),
													value.fieldCommnet
												);
											// 根据数据字段的类型对其他的设置器的数据进行修改
											target
												.getProps()
												.setPropValue(
													path.concat('entityPath').join('.'),
													undefined
												);
											target
												.getProps()
												.setPropValue(
													path.concat('entityColumn').join('.'),
													undefined
												);
											target
												.getProps()
												.setPropValue(
													path.concat('datasourceContrast').join('.'),
													undefined
												);
											target
												.getProps()
												.setPropValue(
													path.concat('dataFormatter').join('.'),
													undefined
												);
											target
												.getProps()
												.setPropValue(
													path.concat('numberFormatter').join('.'),
													undefined
												);
										},
										setter: {
											componentName: 'FieldSetter',
											props: {
												path: entity,
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
											label: '开启编辑',
										},
										defaultValue: true,
										name: 'isEdit',
										setter: 'BoolSetter',
									},

									{
										title: {
											label: '开启时分秒',
											tip: '编辑和筛选的时间选择器是否支持时分秒选择',
										},
										defaultValue: true,
										name: 'showTime',
										condition: (target: ISettingField) => {
											const parentType = target
												.getProps()
												.getPropValue(
													target.path
														.slice(0, -1)
														.concat('parentType')
														.join('.')
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
										condition: (target: ISettingField) => {
											const isEdit = target
												.getProps()
												.getPropValue(
													target.path.slice(0, -1).concat('isEdit').join('.')
												);

											return isEdit;
										},
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
									{
										type: 'group',
										display: 'accordion',
										title: {
											label: '布尔格式化配置',
											tip: '当数据类型为java.lang.Boolean时，设置true和false两个值的显示文本',
										},
										condition: (target: ISettingField) => {
											const fieldType = target
												.getProps()
												.getPropValue(
													target.path.concat('field.fieldType').join('.')
												);
											return fieldType === 'java.lang.Boolean';
										},
										items: [
											{
												name: 'boolTrue',
												title: {
													label: 'true',
													tip: '值为true时显示的文本，默认是`是`',
												},
												defaultValue: '是',
												setter: 'StringSetter',
											},
											{
												name: 'boolFalse',
												title: {
													label: 'false',
													tip: '值为false时显示的文本，默认是`否`',
												},
												defaultValue: '否',
												setter: 'StringSetter',
											},
										],
									},
									{
										type: 'group',
										display: 'accordion',
										title: '实体配置',
										condition: (target: ISettingField) => {
											const parentType = target
												.getProps()
												.getPropValue(
													target.path.concat('parentType').join('.')
												);
											const isEdit = target
												.getProps()
												.getPropValue(target.path.concat('isEdit').join('.'));

											if (parentType) {
												return true && isEdit;
											}

											return false;
										},
										items: [
											{
												name: 'entityPath',
												title: {
													label: '实体路径',
													tip: '需要配置实体路径才可以进行列配置，类中的数据字段是根据实体路径来确定的',
												},
												setter: {
													componentName: 'StringSetter',
												},
											},
											{
												name: 'datasourceContrast',
												title: '数据源',
												setter: {
													componentName: 'VariableSetter',
													props: {
														datasource,
													},
												},
											},
											childrenColumn,
										],
									},
								] as IPublicTypeFieldConfig[],
							},
						},
					},
				},
			},
		});

		// 操作栏按钮配置
		schemas.value.push({
			name: 'toolButtons',
			display: 'accordion',
			title: '操作栏按钮配置',
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
										title: '名称',
										isRequired: true,
										defaultValue: '操作',
										setter: {
											componentName: 'StringSetter',
										},
									},
									{
										name: 'bindClick',
										title: '绑定事件',
										isRequired: true,
										setter: {
											componentName: 'SelectSetter',
											props: {
												options,
											},
										},
									},
									{
										name: 'bindDisabled',
										title: '是否禁用',
										setter: {
											componentName: 'VariableSetter',
											props: {
												datasource,
											},
										},
									},
									{
										name: 'type',
										title: '按钮样式',
										setter: {
											componentName: 'SelectSetter',
											props: {
												options: [
													{
														label: '主要按钮',
														value: 'primary',
													},
													{
														label: '次要按钮',
														value: 'default',
													},
													{
														label: '文本按钮',
														value: 'text',
													},
												],
											},
										},
									},
								] as IPublicTypeFieldConfig[],
							},
						},
					},
				},
			},
		});

		// 操作列按钮配置
		schemas.value.push({
			type: 'group',
			name: 'operationColumn',
			display: 'accordion',
			title: '操作列按钮配置',
			items: [
				{
					name: 'isOperationColumn',
					title: '是否开启列',
					setter: 'BoolSetter',
				},
				{
					name: 'editButton',
					title: '编辑按钮',
					setter: 'BoolSetter',
				},
				{
					name: 'editDisabled',
					title: {
						label: '编辑禁用',
						tip: '编辑按钮是否禁用',
					},
					setter: {
						componentName: 'VariableSetter',
						props: {
							datasource,
						},
					},
				},
				{
					name: 'viewButton',
					title: '查看按钮',
					setter: 'BoolSetter',
				},
				{
					name: 'viewBindClick',
					title: {
						label: '按钮事件',
						tip: '查看按钮事件',
					},
					setter: {
						componentName: 'SelectSetter',
						props: {
							options,
						},
					},
				},
				{
					name: 'viewDisabled',
					title: {
						label: '是否禁用',
						tip: '查看按钮是否禁用',
					},
					setter: {
						componentName: 'VariableSetter',
						props: {
							datasource,
						},
					},
				},
			],
		});

		// 右键菜单配置
		schemas.value.push({
			type: 'field',
			name: 'menuConfig',
			display: 'accordion',
			title: '右键菜单配置',
			setter: {
				componentName: 'ArraySetter',
				props: {
					itemSetter: {
						componentName: 'ObjectSetter',
						props: {
							config: {
								items: [
									{
										name: 'code',
										title: '唯一ID',
										isRequired: true,
										setter: {
											componentName: 'StringSetter',
											props: {
												placeholder: '唯一必填',
											},
										},
									},
									{
										name: 'name',
										title: '菜单名',
										isRequired: true,
										defaultValue: '操作',
										setValue: (target: ISettingField) => {
											const path = target.path.slice(0, -1);
											if (
												isUndefined(
													target
														.getProps()
														.getPropValue(path.concat('code').join('.'))
												)
											) {
												target
													.getProps()
													.setPropValue(
														path.concat('code').join('.'),
														uniqueId('menu_item_')
													);
											}
										},
										setter: 'StringSetter',
									},
									{
										name: 'bindClick',
										title: '绑定事件',
										setter: {
											componentName: 'SelectSetter',
											props: {
												options,
											},
										},
									},
									{
										name: 'isDisabled',
										title: '是否禁用',
										setter: {
											componentName: 'VariableSetter',
											props: {
												datasource,
											},
										},
									},
								] as IPublicTypeFieldConfig[],
							},
						},
					},
				},
			},
		});

		// 高级配置
		schemas.value.push({
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
		});

		// 全局样式
		schemas.value.push({
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
					name: 'border',
					title: '边框',
					defaultValue: 'none',
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
					},
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
		});

		// 编辑模式
		schemas.value.push({
			type: 'group',
			display: 'accordion',
			name: 'editConfig',
			title: '编辑模式',
			items: [
				{
					type: 'field',
					name: 'editTrigger',
					title: {
						label: '触发方式',
						tip: '开启编辑的时候编辑状态的触发方式，手动触发方式，只能用于 mode=row',
					},
					defaultValue: 'dblclick',
					setValue(target: any, value: any) {
						if (value === 'manual') {
							target.getProps().setPropValue('editMode', 'row');
						}
					},
					setter: {
						componentName: 'RadioGroupSetter',
						props: {
							options: [
								{
									label: '双击触发',
									value: 'dblclick',
								},
								{
									label: '手动触发',
									value: 'manual',
								},
								{
									label: '点击触发',
									value: 'click',
								},
							],
						},
					},
				},
				{
					type: 'field',
					name: 'editMode',
					title: {
						label: '编辑模式',
					},
					defaultValue: 'row',
					setter: {
						componentName: 'RadioGroupSetter',
						props: {
							options: [
								{
									label: '行编辑',
									value: 'row',
								},
								{
									label: '单元格编辑',
									value: 'cell',
								},
							],
						},
					},
				},
			],
		});
	}

	return {
		schemas,
		buildSchemas,
	};
}
