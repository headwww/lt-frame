<template>
	<div v-bind="$attrs" style="width: 100%">
		<Codemirror
			v-model="code"
			:style="{ height: '80px' }"
			:extensions="[sql()]"
		>
		</Codemirror>
	</div>
</template>

<script lang="ts" setup>
import { Codemirror } from 'vue-codemirror';
import { sql } from '@codemirror/lang-sql';
import { ref, watch } from 'vue';

const props = defineProps({
	value: String,
});

const emit = defineEmits(['change']);

const code = ref(props.value);

watch(
	() => code.value,
	() => {
		emit('change', code);
	}
);
</script>
