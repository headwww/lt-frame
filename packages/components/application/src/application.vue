<script lang="ts">
import { defineComponent } from 'vue';
import { createBreakpointListen } from '@lt-frame/hooks';

export default defineComponent({
	name: 'LtApplication',
	inheritAttrs: false,
	setup(_, { slots }) {
		createBreakpointListen();
		return () => slots.default?.();
	},
});
</script>
