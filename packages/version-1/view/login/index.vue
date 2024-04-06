<template>
	<div :class="ns.b()">
		<div :class="ns.e('left')">
			<div :class="ns.e('left-logo')">
				<LtSvgIcon name="ltscm" size="120"></LtSvgIcon>
			</div>
			<div :class="ns.e('left-content')">
				<LoginForm />
			</div>
		</div>
		<div :class="ns.e('right')">
			<LtSvgIcon name="login-illustration" size="380"></LtSvgIcon>
			<div :class="ns.e('right-title1')">先进团队，先用朗通</div>
			<div :class="ns.e('right-title2')">
				人、料、机、法、环、测、控，一处搞定
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { useNamespace } from '@lt-frame/hooks';
import { LtSvgIcon } from '@lt-frame/components';
import LoginForm from './login-form.vue';

const ns = useNamespace('login');
</script>
