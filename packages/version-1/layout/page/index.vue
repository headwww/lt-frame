<template>
	<RouterView>
		<template #default="{ Component, route }">
			<KeepAlive>
				<component :is="Component" :key="route.fullPath" />
			</KeepAlive>
		</template>
	</RouterView>
</template>

<script lang="ts" setup></script>
