import { defineComponent, ref } from 'vue';
import type { PropType } from 'vue';

interface MyComponentProps {
	message: string;
}

export default defineComponent({
	props: {
		message: {
			type: String as PropType<string>,
			required: true,
		},
	},
	setup(props: MyComponentProps) {
		const count = ref(0);

		const handleClick = () => {
			count.value += 1;
		};

		return () => (
			<div>
				<p>{props.message}</p>
				<p>Count: {count.value}</p>
				<button onClick={handleClick}>Increment Count</button>
			</div>
		);
	},
});
