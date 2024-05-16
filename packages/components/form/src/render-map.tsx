import { LtButton } from '@lt-frame/components/button';
import { Input, InputNumber, RadioGroup, Select, Switch } from 'ant-design-vue';
import { get, set } from 'lodash-es';
import { LtRender } from './render';

LtRender.renderer.add('$buttons', {
	renderItemContent() {
		return (
			<span>
				<LtButton html-type="submit" type="primary">
					提交
				</LtButton>
				<LtButton html-type="reset" style={{ marginLeft: '12px' }}>
					重置
				</LtButton>
			</span>
		);
	},
});

LtRender.renderer.add('$input', {
	autofocus: '.ant-input',
	renderItemContent(renderOpts, params) {
		const { field, data } = params;
		const { props, attrs, events } = renderOpts;
		const itemValue = get(data, field);
		return (
			<Input
				class={['valid', 'full']}
				{...props}
				{...attrs}
				{...events}
				value={itemValue}
				onChange={(e) => {
					set(data, field, e.target.value);
				}}
			></Input>
		);
	},
});

LtRender.renderer.add('$input-number', {
	renderItemContent(renderOpts, params) {
		const { field, data } = params;
		const { props, attrs, events } = renderOpts;
		const itemValue = get(data, field);
		return (
			<InputNumber
				class={['valid', 'full']}
				{...props}
				{...attrs}
				{...events}
				value={itemValue}
				onChange={(e) => {
					set(data, field, e);
				}}
			></InputNumber>
		);
	},
});

LtRender.renderer.add('$switch', {
	renderItemContent(renderOpts, params) {
		const { field, data } = params;
		const { props, attrs, events } = renderOpts;
		const itemValue = get(data, field);
		return (
			<Switch
				{...props}
				{...attrs}
				{...events}
				checked={itemValue}
				onChange={(e) => {
					set(data, field, e);
				}}
			></Switch>
		);
	},
});

LtRender.renderer.add('$select', {
	renderItemContent(renderOpts, params) {
		const { field, data } = params;
		const { props, attrs, events } = renderOpts;
		const itemValue = get(data, field);
		return (
			<Select
				{...props}
				{...attrs}
				{...events}
				value={itemValue}
				onChange={(e) => {
					set(data, field, e);
				}}
			></Select>
		);
	},
});

LtRender.renderer.add('$radio-group', {
	renderItemContent(renderOpts, params) {
		const { field, data } = params;
		const { props, attrs, events } = renderOpts;
		const itemValue = get(data, field);
		return (
			<RadioGroup
				{...props}
				{...attrs}
				{...events}
				value={itemValue}
				onChange={(e) => {
					set(data, field, e.target.value);
				}}
			></RadioGroup>
		);
	},
});
