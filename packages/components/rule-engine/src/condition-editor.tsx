import { defineComponent, PropType, ref } from 'vue';
import { Button, Select } from 'ant-design-vue';
import {
	CloseCircleOutlined,
	DeleteFilled,
	FolderAddOutlined,
	PlusCircleOutlined,
} from '@ant-design/icons-vue';
import { findTree, mapTree } from 'xe-utils';
import { cloneDeep } from 'lodash-es';
import { ConditionExpr } from './types/ConditionExpr';

export const ConditionEditor = defineComponent({
	name: 'ConditionEditor',
	props: {
		conditionExpr: Array as PropType<Array<ConditionExpr>>,
	},
	emits: ['add', 'delete', 'update:conditionExpr'],
	setup(props, { emit, slots }) {
		function isDelete(con: ConditionExpr) {
			const { conditionExpr } = props;
			if (conditionExpr) {
				const find = findTree(
					conditionExpr,
					(item) => con.parentId === item.id
				);
				return find.item.children?.length === 1;
			}
			return true;
		}

		function renderItem(item: ConditionExpr) {
			return (
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
					}}
				>
					{slots.item?.(item)}
					<Button
						onClick={() => {
							emit('delete', item);
						}}
						disabled={isDelete(item)}
						size="small"
						type="link"
					>
						{{
							icon: () => <DeleteFilled class="lt-ce-delete" />,
						}}
					</Button>
				</div>
			);
		}

		function renderGroup(conditions: ConditionExpr) {
			const selectValue = ref(
				conditions.conditionType ? conditions.conditionType : 'AND'
			);
			const handleChange = (v: any) => {
				const arr = mapTree(cloneDeep(props.conditionExpr), (item) => {
					if (conditions.id === item.id) {
						return {
							...item,
							conditionType: v,
						};
					}
					return item;
				});
				emit('update:conditionExpr', arr);
			};

			return (
				<>
					<div class="lt-ce-input">
						<div class="lt-ce-item">
							<div class="lt-ce-condition">
								<Select
									value={selectValue.value}
									onChange={handleChange}
									style="width: 60px"
								>
									<Select.Option value={'AND'}>且</Select.Option>
									<Select.Option value={'OR'}>或</Select.Option>
								</Select>
							</div>
							<div class="lt-ce-options">
								{conditions.children?.map((item) => (
									<div
										class={{
											'lt-ce-option': true,
											'is-group': item.type === 'group',
										}}
									>
										{item.type === 'group'
											? renderGroup(item)
											: renderItem(item)}
									</div>
								))}
							</div>
						</div>
						<div class="lt-ce-bts">
							<Button
								onClick={() => {
									emit('add', { item: conditions, type: 'single' });
								}}
								size="small"
								type="text"
							>
								{{
									icon: () => <PlusCircleOutlined />,
									default: () => '添加条件',
								}}
							</Button>
							<Button
								onClick={() => {
									emit('add', { item: conditions, type: 'group' });
								}}
								size="small"
								type="text"
							>
								{{
									icon: () => (
										<FolderAddOutlined style={{ fontSize: '14px' }} />
									),
									default: () => '添加条件组',
								}}
							</Button>
						</div>
					</div>
					{conditions.parentId && (
						<Button
							onClick={() => {
								emit('delete', conditions);
							}}
							class="lt-ce-delete-group"
							size="small"
							type="link"
							disabled={isDelete(conditions)}
						>
							{{
								icon: () => <CloseCircleOutlined />,
							}}
						</Button>
					)}
				</>
			);
		}

		return () => {
			const { conditionExpr } = props;
			return conditionExpr?.map((item) =>
				item.type === 'group' ? renderGroup(item) : renderItem(item)
			);
		};
	},
});
