<template>
	<vxe-grid
		:class="getGridConfigs.thumb ? 'lt-table-scrollbar' : ''"
		v-bind="getGridConfigs"
		ref="vxeGridRef"
	>
		<template v-if="gridConfigs?.enableEdit" #lt-edit-column="params">
			<template v-if="isActiveStatus(params.row)">
				<a-button
					@click="cancelRowEvent(params)"
					style="color: #6a6a6a"
					type="text"
					shape="circle"
					size="small"
					:icon="h(StopOutlined)"
				/>
			</template>
			<template v-else>
				<a-button
					@click="editRowEvent(params.row)"
					style="color: #6a6a6a"
					type="text"
					shape="circle"
					:icon="h(EditOutlined)"
				/>
			</template>
		</template>

		<template v-if="gridConfigs?.operateColumConfig" #lt-edit-operate="params">
			<GridOperateColumn
				:operate-colum-config="getGridConfigs.operateColumConfig"
				:params="params"
			></GridOperateColumn>
		</template>

		<template #[item]="data" v-for="item in Object.keys($slots)">
			<slot :name="item" v-bind="data || {}"></slot>
		</template>
	</vxe-grid>
</template>

<script lang="ts" setup>
import { deepMerge } from '@lt-frame/utils';
import { PropType, computed, h, ref } from 'vue';
import { Button as AButton } from 'ant-design-vue';
import { StopOutlined, EditOutlined } from '@ant-design/icons-vue';
import { VxeGridInstance } from 'vxe-table';
import { LTGridProps, LTColumns } from './grid';
import GridOperateColumn from './components/grid-operate-column.vue';

defineOptions({
	name: 'LTGrid',
});

const vxeGridRef = ref<VxeGridInstance>();

const props = defineProps({
	gridConfigs: {
		type: Object as PropType<LTGridProps>,
	},
});

/** 开启编辑 */
const editRowEvent = async (row: any) => {
	const $grid = vxeGridRef.value;
	if ($grid) {
		$grid.setEditRow(row);
	}
};

/** 是否是编辑状态 */
function isActiveStatus(row: any) {
	const $grid = vxeGridRef.value;
	if ($grid) {
		return $grid.isEditByRow(row);
	}
	return false;
}

/** 取消编辑并还原数据 */
async function cancelRowEvent(params: any) {
	const $grid = vxeGridRef.value;

	if ($grid) {
		await $grid.clearEdit();
		if (params.row._X_ROW_INSERT) {
			$grid.remove(params.row);
		} else {
			await $grid.revertData(params.row);
		}
	}
}

const getGridConfigs = computed((): LTGridProps => {
	const seq = {
		type: 'seq',
		width: 40,
		fixed: 'left',
		align: 'center',
	};

	const checkbox = {
		type: 'checkbox',
		width: 40,
		fixed: 'left',
		align: 'center',
	};

	const edit = {
		title: '编辑',
		width: 55,
		minWidth: 55,
		slots: { default: 'lt-edit-column' },
		fixed: 'left',
		align: 'center',
	};

	const operate = {
		title: '编辑',
		width: 100,
		slots: { default: 'lt-edit-operate' },
		fixed: 'right',
		align: 'center',
	};

	const columns: LTColumns = [];
	const { gridConfigs } = props;
	if (gridConfigs) {
		if (gridConfigs.enableCheckbox) {
			columns.push(checkbox as any);
		}
		if (gridConfigs.enableSeq) {
			columns.push(seq as any);
		}
		if (gridConfigs.enableEdit) {
			columns.push(edit as any);
		}
		if (gridConfigs.operateColumConfig) {
			const { width } = gridConfigs.operateColumConfig;
			if (width) {
				operate.width = width;
			}
			columns.push(operate as any);
		}
	}

	const options = deepMerge(
		{
			// 是否带有斑马纹（需要注意的是，在可编辑表格场景下，临时插入的数据不会有斑马纹样式）
			stripe: true,
			// 是否开启滚动默认开启滚动条
			thumb: true,
			// 表格的尺寸
			size: 'small',
			// 设置所有内容过长时显示为省略号（如果是固定列建议设置该值，提升渲染速度）
			showOverflow: true,
			// 保持原始值的状态，被某些功能所依赖，比如编辑状态、还原数据等（开启后影响性能，具体取决于数据量）
			keepSource: true,
			// 默认开启虚拟滚动
			scrollY: { enabled: true },
			// 默认最大高度是100%
			height: '100%',
			// 复选框配置项
			checkboxConfig: {
				// 绑定选中属性（行数据中必须存在该字段，否则无效）
				checkField: '$_checked',
				// 触发方式（注：当多种功能重叠时，会同时触发）
				trigger: 'cell',
				// 高亮勾选行
				highlight: true,
				// 开启复选框范围选择功能（启用后通过鼠标在复选框的列内滑动选中或取消指定行）
				range: true,
				// 开启复选框指定行选择功能（启用后通过鼠标点击和 shift 键选取指定范围的行）
				isShiftKey: true,
				// 严格模式，当数据为空或全部禁用时，列头的复选框为禁用状态
				strict: true,
			},
			// 列配置信息
			columnConfig: {
				// 每一列是否启用列宽调整
				resizable: true,
			},
			// 可编辑配置项
			editConfig: {
				// 触发方式
				trigger: 'manual',
				// 编辑模式
				mode: 'row',
				// 只对 keep-source 开启有效，是否显示单元格新增与修改状态
				showStatus: true,
				// 是否显示必填字段的红色星号
				showAsterisk: false,
			},
			// 行配置信息
			rowConfig: {
				// 当鼠标移到行时，是否要高亮当前行
				isHover: true,
				// 当鼠标点击行时，是否要高亮当前行
				isCurrent: true,
			},
			columns,
		} as LTGridProps,
		props.gridConfigs,
		'union'
	);

	return options;
});
</script>
