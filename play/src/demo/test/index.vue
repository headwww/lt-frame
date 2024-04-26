<template>
	<div class="demo">
		<SplitPaneLayout horizontal style="height: 400px; background-color: white">
			<Pane>1</Pane>
			<Pane>
				<SplitPaneLayout>
					<Pane>1</Pane>
					<Pane>1</Pane>
					<Pane>1</Pane>
				</SplitPaneLayout>
			</Pane>
			<Pane :minSize="21">2</Pane>
		</SplitPaneLayout>
	</div>
</template>

<script lang="ts" setup>
import {
	LtSplitpanes as SplitPaneLayout,
	LtPane as Pane,
} from '@lt-frame/components';
</script>

<style lang="scss">
.demo {
	font-size: 50px;

	.splitpanes__splitter {
		border: 1px;
	}
}
</style>
