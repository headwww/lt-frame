<template>
	<a-dropdown :trigger="trigger" v-bind="$attrs">
		<span>
			<slot></slot>
		</span>
		<template #overlay>
			<a-menu :selectedKeys="selectedKeys">
				<template v-for="item in dropMenuList" :key="`${item.event}`">
					<a-menu-item
						v-bind="getAttr(item.event)"
						@click="handleClickMenu(item)"
						:disabled="item.disabled"
					>
						<a-popconfirm
							v-if="popconfirm && item.popConfirm"
							v-bind="getPopConfirmAttrs(item.popConfirm)"
							:disabled="item.disabled"
						>
							<template #icon v-if="item.popConfirm.icon">
								<Icon :icon="item.popConfirm.icon" />
							</template>
							<div>
								<Icon :icon="item.icon" v-if="item.icon" />
								<span style="margin-left: 1px">{{ item.text }}</span>
							</div>
						</a-popconfirm>
						<template v-else>
							<Icon :icon="item.icon" v-if="item.icon" />
							<span style="margin-left: 1px">{{ item.text }}</span>
						</template>
					</a-menu-item>
					<a-menu-divider v-if="item.divider" :key="`d-${item.event}`" />
				</template>
			</a-menu>
		</template>
	</a-dropdown>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { Dropdown, Menu, Popconfirm } from 'ant-design-vue';
import { isFunction, omit } from 'lodash-es';
import Icon from '../../icon';
import { dropdownProps, type DropMenu } from './dropdown';

defineOptions({
	name: 'LTDropdown',
});
const ADropdown = Dropdown;
const AMenu = Menu;
const AMenuItem = Menu.Item;
const AMenuDivider = Menu.Divider;
const APopconfirm = Popconfirm;

const props = defineProps(dropdownProps);

const emit = defineEmits(['menuEvent']);

function handleClickMenu(item: DropMenu) {
	const { event } = item;
	const menu = props.dropMenuList.find(
		(item) => `${item.event}` === `${event}`
	);
	emit('menuEvent', menu);
	item.onClick?.();
}

const getPopConfirmAttrs = computed(() => (attrs: any) => {
	const originAttrs = omit(attrs, ['confirm', 'cancel', 'icon']);
	if (!attrs.onConfirm && attrs.confirm && isFunction(attrs.confirm))
		originAttrs.onConfirm = attrs.confirm;
	if (!attrs.onCancel && attrs.cancel && isFunction(attrs.cancel))
		originAttrs.onCancel = attrs.cancel;
	return originAttrs;
});

const getAttr = (key: string | number) => ({ key });
</script>
./dropdown
