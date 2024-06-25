<template>
	<LtPageLayout>
		<LtSplitpanes class="default-theme" style="height: 400px">
			<LtPane>1</LtPane>
			<LtPane>
				<LtSplitpanes horizontal>
					<LtPane>6</LtPane>
					<LtPane>4</LtPane>
					<LtPane>5</LtPane>
				</LtSplitpanes>
			</LtPane>
			<LtPane>2</LtPane>
		</LtSplitpanes>

		<LtSplitpanes
			class="default-theme"
			horizontal
			style="height: 400px; margin-top: 12px"
		>
			<LtPane min-size="20" max-size="70">
				<span>11</span>
			</LtPane>
			<LtPane>
				<span>2</span>
			</LtPane>
			<LtPane max-size="70">
				<span>3</span>
			</LtPane>
		</LtSplitpanes>
	</LtPageLayout>
</template>

<script lang="ts" setup>
import { LtSplitpanes, LtPane, LtPageLayout } from '@lt-frame/components';
</script>

<style scoped lang="scss">
.splitpanes__pane {
	display: flex;
	justify-content: center;
	align-items: center;
	color: rgb(201 34 34);
	font-size: 50px;
	background-color: rgb(199 220 255);
}
</style>
