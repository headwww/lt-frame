<template>
	<LtPageLayout title="右键菜单">
		<lt-button type="primary" @contextmenu="handleContext">
			Right Click on me
		</lt-button>

		<lt-button type="primary" @contextmenu="handleMultipleContext">
			Right Click on me
		</lt-button>
	</LtPageLayout>
</template>

<script setup lang="ts">
import { LtPageLayout, LtButton, useContextMenu } from '@lt-frame/components';
import { useMessage } from '@lt-frame/hooks';

const [createContextMenu] = useContextMenu();
const { createMessage } = useMessage();

function handleContext(e: MouseEvent) {
	createContextMenu({
		event: e,
		items: [
			{
				label: 'New',
				icon: 'bi:plus',
				handler: () => {
					createMessage.success('click new');
				},
			},
			{
				label: 'Open',
				icon: 'bx:bxs-folder-open',
				handler: () => {
					createMessage.success('click open');
				},
			},
		],
	});
}

function handleMultipleContext(e: MouseEvent) {
	createContextMenu({
		event: e,
		items: [
			{
				label: 'New',
				icon: 'bi:plus',

				children: [
					{
						label: 'New1-1',
						icon: 'bi:plus',
						divider: true,
						children: [
							{
								label: 'New1-1-1',
								handler: () => {
									createMessage.success('click new');
								},
							},
							{
								label: 'New1-2-1',
								disabled: true,
							},
						],
					},
					{
						label: 'New1-2',
						icon: 'bi:plus',
					},
				],
			},
		],
	});
}
</script>
