<template>
	<div
		class="nav-sort-area"
		:class="{
			edit: edit,
		}"
	>
		<div style="position: relative">
			<div>
				<div
					class="sort-virtual-box"
					:class="{ 'show-border': edit }"
					style="margin-left: 0; width: 430px"
				>
					<template v-for="(_item, index) in navList" :key="_item.fid">
						<div
							class="sort-virtual-box-item"
							:class="{
								'item-first-row': index < 5,
								'item-row-last': index < 4 ? false : (index - 4) % 5 === 0,
							}"
							style="width: 86px; height: 112px"
						></div>
					</template>
					<div
						v-if="edit"
						class="sort-virtual-box-item"
						:class="{
							'item-first-row': navList.length < 5,
							'item-row-last': (navList.length - 4) % 5 === 0,
						}"
						style="width: 86px; height: 112px"
					></div>
				</div>
			</div>

			<div class="nav-sort-area-mainNav">
				<div
					class="sort-container sort-container-1 sort-container-main"
					:class="{ 'sort-container-edit': edit }"
				>
					<LtDraggable
						ref="draggableRef"
						v-model="navList"
						class="sort-container-draggable"
						:disabled="!edit"
						:animation="150"
						@update="onUpdate"
					>
						<div
							v-for="item in navList"
							:key="item.fid"
							class="sort-item sortable-item-v7 sortable-item"
							:class="{
								edit: edit,
							}"
							@click="onItem(item)"
						>
							<div class="sort-item-inner">
								<div
									:class="{
										edit: edit,
									}"
								>
									<div class="logo-update">
										<LtIcon :icon="item.icon ? item.icon : ''"> </LtIcon>
									</div>
									<div class="name g-ellipsis">{{ item.title }}</div>
								</div>
							</div>
							<div
								v-if="edit"
								@click.stop="onRemove(item)"
								class="sort-item-icon"
							>
								<MinusCircleFilled
									class="minus-circle-filled"
								></MinusCircleFilled>
							</div>
						</div>

						<Popover
							v-model:open="popoverOpen"
							:overlayInnerStyle="{
								padding: '4px',
							}"
							trigger="click"
							placement="right"
							:arrow="false"
						>
							<template #content>
								<div
									class="pop-create-item"
									v-for="item in events"
									:key="item.code"
									@click="onAdd(item.code)"
								>
									<component :is="item.icon" />
									<span style="margin-left: 6px"> {{ item.title }} </span>
								</div>
							</template>
							<div v-if="edit" class="nav-add-btn">
								<AButton
									type="dashed"
									class="logo"
									shape="circle"
									:icon="
										h(PlusOutlined, {
											style: {
												fontSize: '12px',
											},
										})
									"
								></AButton>
								<div class="creat">创建应用</div>
							</div>
						</Popover>
					</LtDraggable>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { ref, h, watch, defineComponent, SetupContext } from 'vue';
import { Button as AButton, Popover } from 'ant-design-vue';
import { PlusOutlined, MinusCircleFilled } from '@ant-design/icons-vue';
import { LtDraggable, LtIcon } from '@lt-frame/components';
import { FeatureConfig } from '../../../types';
import { featureMenuProps, FeatureMenuProps } from './types';

const componentOptions = {
	props: featureMenuProps,
	emits: ['add', 'item', 'remove', 'update:list'],
	components: {
		Popover,
		MinusCircleFilled,
		LtDraggable,
		LtIcon,
		AButton,
	},
	setup(props: FeatureMenuProps, { emit }: SetupContext) {
		const navList = ref([...props.list]);

		watch(
			() => props.list,
			() => {
				navList.value = [...props.list];
			},
			{
				deep: true,
			}
		);

		function onUpdate() {
			emit('update:list', navList.value);
		}

		const popoverOpen = ref(false);

		function onAdd(index: number | string) {
			emit('add', index);
			popoverOpen.value = false;
		}

		function onItem(item: FeatureConfig) {
			emit('item', item);
		}

		function onRemove(item: FeatureConfig) {
			emit('remove', item);
		}

		return {
			navList,
			popoverOpen,
			onUpdate,
			onAdd,
			onItem,
			onRemove,
			h,
			PlusOutlined,
		};
	},
};

export default defineComponent(componentOptions);
</script>
