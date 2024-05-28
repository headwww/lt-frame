import { defineComponent } from 'vue';

export const Field = defineComponent({
	name: 'Field',

	setup(props, { slots }) {
		return () => {
			<div class="lt-field">
				<div class="lt-field-head"></div>
				<div class="lt-field-body">
					{slots.default ? slots.default() : null}
				</div>
			</div>;
		};
	},
});
