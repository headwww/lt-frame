<template>
	<div class="fcm-preview-pc">
		<div class="fcm-preview-pc-left">
			<div style="display: flex; margin-top: 14px">
				<div
					class="circle"
					style="background-color: #ed6a5e; border-color: #d79894"
				></div>
				<div
					class="circle"
					style="background-color: #f5bd4f; border-color: #f5ad4f"
				></div>
				<div
					class="circle"
					style="background-color: #62c453; border-color: #62b453"
				></div>
			</div>
			<div class="fcm-preview-pc-left-menu">
				<slot></slot>
			</div>
		</div>

		<div class="fcm-preview-pc-right">
			<SkeletonButton style="margin-bottom: 12px" size="small"></SkeletonButton>
			<Space>
				<SkeletonAvatar></SkeletonAvatar>
				<SkeletonAvatar></SkeletonAvatar>
				<SkeletonAvatar></SkeletonAvatar>
				<SkeletonAvatar></SkeletonAvatar>
			</Space>
			<Skeleton style="margin-top: 12px" avatar :paragraph="{ rows: 1 }" />
			<Skeleton avatar :paragraph="{ rows: 1 }" />
			<Skeleton avatar :paragraph="{ rows: 1 }" />
			<Skeleton avatar :paragraph="{ rows: 1 }" />
			<Skeleton avatar :paragraph="{ rows: 1 }" />
		</div>
	</div>
</template>

<script lang="ts" setup>
import {
	Space,
	Skeleton,
	SkeletonAvatar,
	SkeletonButton,
} from 'ant-design-vue';
</script>
