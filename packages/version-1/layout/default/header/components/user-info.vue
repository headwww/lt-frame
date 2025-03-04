<template>
	<vxe-pulldown
		popup-class-name="lt-pcn-user-info"
		ref="pulldownRef"
		placement="bottom"
		transfer
		destroyOnClose
	>
		<template #default>
			<div @click="handleOpenChange" :class="ns.b()">
				<Avatar :class="ns.e('avatar')">
					{{ getClient?.user?.employee.name[0] }}
				</Avatar>
				<div :class="ns.e('content')">
					<div :class="ns.e('content-name')">
						{{ getClient?.user?.employee.name }}
					</div>
					<div :class="ns.e('content-tag')">
						<span :class="ns.e('content-tag-content')" style="cursor: inherit"
							><div :class="ns.e('content-tag-content-text')">
								{{ getClient?.user?.username }}
							</div></span
						>
					</div>
				</div>
				<div :style="rotate" style="transition: transform 0.3s ease">
					<CaretDownOutlined style="color: rgb(100 106 115)" />
				</div>
			</div>
		</template>

		<template #dropdown>
			<div class="lt-uinfo-content">
				<div class="lt-uinfo-header">
					<Avatar :size="48" style="background-color: #f56a00">
						{{ getClient?.user?.employee.name[0] }}
					</Avatar>
					<div class="lt-uinfo-information">
						<div class="lt-uinfo-name">
							{{ getClient?.user?.username }}
						</div>
						<div style="font-size: 12px">
							{{ getClient?.corp?.name }}
						</div>
					</div>
				</div>
				<div class="lt-uinfo-body">
					<div class="lt-uinfo-item">
						<div class="lt-uinfo-item-title">
							<div
								style="
									white-space: nowrap;
									text-overflow: ellipsis;
									overflow: hidden;
									vertical-align: top;
									cursor: inherit;
								"
							>
								语言
							</div>
						</div>
						<RightOutlined />
					</div>
					<div @click="onLog" class="lt-uinfo-item">
						<div class="lt-uinfo-item-title">
							<div
								style="
									white-space: nowrap;
									text-overflow: ellipsis;
									overflow: hidden;
									vertical-align: top;
									cursor: inherit;
								"
							>
								错误日志
							</div>
						</div>
						<RightOutlined />
					</div>
				</div>
				<div class="lt-uinfo-footer">
					<div @click="onLogin" class="lt-uinfo-footer-item">退出登录</div>
				</div>
			</div>
		</template>
	</vxe-pulldown>
</template>

<script lang="ts" setup>
import { useNamespace } from '@lt-frame/hooks';
import { computed, ref, watch } from 'vue';
import { Avatar } from 'ant-design-vue';
import { CaretDownOutlined, RightOutlined } from '@ant-design/icons-vue';
import { VxePulldownInstance } from 'vxe-pc-ui';
import { useUserStore } from '../../../../stores';
import { useGo } from '../../../../hooks';

const ns = useNamespace('user-info');

const userStore = useUserStore();

const rotation = ref(0);

const open = ref(false);

const getClient = computed(() => userStore.getClient);

const pulldownRef = ref<VxePulldownInstance>();

const go = useGo();

const rotate: any = computed(() => ({
	transform: `rotate(${rotation.value}deg)`,
}));

const handleOpenChange = () => {
	open.value = !open.value;
	rotation.value = open.value ? 180 : 0;
	const $pulldown = pulldownRef.value;
	$pulldown?.togglePanel();
};

watch(open, (v) => {
	if (!v) {
		rotation.value = 0;
	}
});

function onLogin() {
	const $pulldown = pulldownRef.value;
	$pulldown?.togglePanel();
	userStore.confirmLoginOut();
}

function onLog() {
	const $pulldown = pulldownRef.value;
	$pulldown?.togglePanel();
	go('/error-log');
}
</script>
