<template>
	<div></div>
</template>

<script lang="ts" setup>
import { useAttrs } from '@lt-frame/hooks';

useAttrs({
	excludeDefaultKeys: false,
	excludeKeys: ['onClick'],
	excludeListeners: true,
});
</script>
