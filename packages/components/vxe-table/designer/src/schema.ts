import { IPublicTypeFieldConfig } from '@lt-frame/components/lowcode-engine/src/types/field-config';

export const items: IPublicTypeFieldConfig[] = [
	{
		type: 'field',
		name: 'key1',
		title: {
			label: '标题1',
			tip: '测试',
		},
		setValue: (target: any, value: any) => {
			if (value === '2') {
				target.getProps().setPropValue('key3', 'center');
			}
			console.log(target, value);
		},
		defaultValue: '1ces',
		setter: 'StringSetter',
	},
	{
		type: 'field',
		name: 'key2',
		display: 'inline',
		condition: (target: any) => target.getProps().node.value.key1 === 'a',
		title: '标题2',
		defaultValue: true,
		setter: 'BoolSetter',
	},
	{
		type: 'field',
		name: 'key3',
		title: '标题3-display: block',
		display: 'block',
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
		type: 'group',
		name: 'group1',
		display: 'accordion',
		title: {
			label: 'group',
			tip: 'tipppppppppp',
		},
		items: [
			{
				type: 'field',
				name: 'g-key1',
				condition: (target: any) => target.getProps().node.value.key1 === 'a',
				title: {
					label: '标题',
					tip: '------',
				},
				setter: {
					componentName: 'BoolSetter',
				},
			},
			{
				type: 'field',
				name: 'g-key2',
				title: 'g-key2',
				setter: {
					componentName: 'BoolSetter',
				},
			},
		],
	},
	{
		name: 'operationConfig',
		display: 'accordion',
		title: '底部操作',
		setter: {
			componentName: 'ObjectSetter',
			props: {
				config: {
					items: [
						{
							condition: (target: any) =>
								target.getProps().node.value.key1 === 'a',
							type: 'field',
							name: 'obj-key1',
							title: {
								label: 'obj1',
								tip: '测试',
							},
							setter: 'StringSetter',
						},
						{
							type: 'field',
							name: 'obj-key2',
							display: 'inline',
							title: 'obj2',
							setter: 'BoolSetter',
						},
					],
				},
			},
		},
	},
	{
		name: 'columns',
		title: '数据列',
		display: 'accordion',
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
									title: '列标题',
									setter: 'StringSetter',
								},
								{
									name: 'dataKey',
									title: '列索引',
									isRequired: true,
									setter: 'StringSetter',
								},
								{
									title: '宽度',
									name: 'width',
									setter: 'StringSetter',
								},
							],
						},
					},
				},
			},
		},
	},
];
