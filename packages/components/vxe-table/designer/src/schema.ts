import { FieldConfig } from './types/field';
import { SetterConfig } from './types/setter';

export const TableSchema: FieldConfig[] = [
	{
		type: 'field',
		name: 'columns',
		title: '列配置',
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
								name: 'title',
								title: '标题',
								isRequired: true,
								setter: 'StringSetter',
							},
							{
								name: 'field',
								title: '字段名',
								isRequired: true,
								setter: 'StringSetter',
							},
							{
								name: 'visible',
								title: '省略',
								isRequired: true,
								setter: 'BoolSetter',
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
			{
				type: 'field',
				name: 'headerAlign',
				title: {
					label: '表头对齐',
					tip: '所有的表头列的对齐方式',
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
			{
				type: 'field',
				name: 'headerAlign',
				title: {
					label: '表尾对齐',
					tip: '所有的表尾列的对齐方式',
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
			{
				type: 'field',
				name: 'showHeader',
				title: '显示表头',
				setter: 'BoolSetter',
			},
			{
				type: 'field',
				name: 'showFooter',
				title: '显示表尾',
				setter: 'BoolSetter',
			},
			{
				type: 'field',
				name: 'showOverflow',
				title: {
					label: '内容显示方式',
					tip: '设置所有内容过长时显示为省略号（如果是固定列建议设置该值，提升渲染速度）',
				},
				setter: {
					componentName: 'SelectSetter',
					initialValue: null,
					props: {
						options: [
							{
								label: '全部显示',
								value: null,
							},
							{
								label: '省略号',
								value: 'default',
							},
							{
								label: '提示性省略',
								value: 'tooltip',
							},
						],
					},
				},
			},
			{
				type: 'field',
				name: 'showHeaderOverflow',
				title: {
					label: '表头显示方式',
					tip: '设置表头所有内容过长时显示为省略号',
				},
				setter: {
					componentName: 'SelectSetter',
					props: {
						options: [
							{
								label: '全部显示',
								value: false,
							},
							{
								label: '省略号',
								value: 'default',
							},
							{
								label: '提示性省略',
								value: 'tooltip',
							},
						],
					},
				},
			},
			{
				type: 'field',
				name: 'showFooterOverflow',
				title: {
					label: '内容显示方式',
					tip: '设置表尾所有内容过长时显示为省略号',
				},
				setter: {
					componentName: 'SelectSetter',
					props: {
						options: [
							{
								label: '全部显示',
								value: false,
							},
							{
								label: '省略号',
								value: 'default',
							},
							{
								label: '提示性省略',
								value: 'tooltip',
							},
						],
					},
				},
			},
		],
	},
	{
		type: 'field',
		name: 'columnConfig',
		title: '列配置信息',
		display: 'accordion',
		setter: {
			componentName: 'ObjectSetter',
			props: {
				config: [
					{
						name: 'isCurrent',
						title: {
							label: '行高亮',
							tip: '当鼠标点击列头时，是否要高亮当前列',
						},
						setter: 'BoolSetter',
					},
					{
						name: 'isHover',
						title: {
							label: '列头高亮',
							tip: '当鼠标移到列头时，是否要高亮当前头',
						},
						initialValue: true,
						setter: 'BoolSetter',
					},
				] as Array<FieldConfig>,
			},
		},
	},
];
