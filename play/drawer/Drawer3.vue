<template>
	<LTDrawer
		v-bind="$attrs"
		title="Modal Title"
		width="50%"
		showFooter
		@ok="handleOk"
	>
		<p v-for="index in 40" :key="index">根据屏幕高度自适应</p>
		<template #insertFooter>
			<a-button> btn</a-button>
		</template>
		<template #centerFooter>
			<a-button> btn2</a-button>
		</template>

		<template #appendFooter>
			<a-button> btn3</a-button>
		</template>

		<!-- <template #footer>
      <a-button> customerFooter</a-button>
    </template> -->
	</LTDrawer>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { LTDrawer } from '@lt-frame/components';
import { Button as AButton } from 'ant-design-vue';

export default defineComponent({
	components: { LTDrawer, AButton },
	setup() {
		return {
			handleOk: () => {
				//
			},
		};
	},
});
</script>
