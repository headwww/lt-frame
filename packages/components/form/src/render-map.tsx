import { LtButton } from '@lt-frame/components/button';
import { Input, InputNumber } from 'ant-design-vue';
import { get, set } from 'lodash-es';
import { LtRender } from './render';

LtRender.renderer.add('$buttons', {
	renderItemContent(renderOpts, params) {
		const { $form } = params;
		$form.props;
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
