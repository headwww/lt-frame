<script lang="tsx">
import { defineComponent, reactive, h } from 'vue';
import { Button } from 'ant-design-vue';
import { LtLowCodeRender } from '@lt-frame/components';

const RenderComponent = (params: any) => {
	const { schema, state } = params;
	const { componentName, children, props } = schema;
	state;
	children;
	// 解析 props
	const parsedProps: any = {};
	// eslint-disable-next-line guard-for-in
	for (const propKey in props) {
		const propValue = props[propKey];
		if (propValue && propValue.type === 'JSExpression') {
			// 处理 JSExpression 类型，支持通过 state 访问数据
			// eslint-disable-next-line no-eval
			parsedProps[propKey] = eval(propValue.value);
		} else {
			parsedProps[propKey] = propValue;
		}
	}

	// 获取组件渲染器
	const comp = LtLowCodeRender.renderer
		.get(componentName)
		?.createMaterial?.(parsedProps);

	if (!comp) {
		console.warn(`未找到组件: ${componentName}`);
		return h('div', `组件 "${componentName}" 未找到`);
	}

	// 使用 h 函数创建组件
	return h(
		comp, // 组件实例
		{}, // 传递的 props
		{
			default: () =>
				children
					? children.map((child: any, index: number) =>
							h(RenderComponent, { schema: child, state, key: index })
						)
					: undefined, // 子组件递归渲染
		}
	);
};

export default defineComponent({
	props: {
		schema: {
			type: Object,
			required: true,
		},
	},

	setup(props) {
		const state = reactive(generateStateFromSchema(props.schema.state));

		// 将状态返回，供 render 函数使用
		return {
			state,
		};
	},

	render() {
		// 这里可以访问 this.schema 和 this.state
		return (
			<div>
				<Button
					onClick={() => {
						this.state.text = '12121';
					}}
				>
					dsda
				</Button>
				<RenderComponent schema={this.schema} state={this.state} />
			</div>
		);
	},
});

// 动态生成初始状态对象
const generateStateFromSchema = (stateSchema: any) => {
	const state: any = {};
	// eslint-disable-next-line guard-for-in
	for (const key in stateSchema) {
		if (stateSchema[key].type === 'JSExpression') {
			state[key] = stateSchema[key].value;
		} else {
			state[key] = stateSchema[key]; // 如果不是 JSExpression，直接使用值
		}
	}
	return state;
};
</script>
