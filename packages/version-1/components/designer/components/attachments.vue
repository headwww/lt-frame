<template>
	<a-list
		style="
			min-height: 450px;
			background-color: white;
			max-height: 450px;
			overflow-y: auto;
		"
		:loading="initLoading"
		item-layout="horizontal"
		:data-source="list"
	>
		<template #renderItem="{ item }">
			<a-list-item>
				<template #actions>
					<a-button
						size="small"
						key="attachment-down"
						type="text"
						style="color: #1890ff"
						@click="onDownload(item)"
						>下载</a-button
					>

					<a-button
						size="small"
						key="attachment-del"
						type="text"
						danger
						@click="onDel(item)"
						>删除</a-button
					>
				</template>
				<a-skeleton avatar :title="false" :loading="!!item.loading" active>
					<a-list-item-meta>
						<template #title>
							<p>{{ item.attachName }}</p>
						</template>
						<template #description>
							<p>
								{{
									item.owner.employee.name +
									'  ' +
									formatDate(item.createDate) +
									' ' +
									(item.attachSize / 1024).toFixed(2) +
									'M'
								}}
							</p>
						</template>
						<template #avatar>
							<component :is="getFileIcon(item)" />
						</template>
					</a-list-item-meta>
					<!-- <div>content</div> -->
				</a-skeleton>
			</a-list-item>
		</template>
	</a-list>

	<div class="file-input-wrapper">
		<input
			type="file"
			ref="fileInput"
			style="display: none"
			@change="handleFileChange"
		/>
	</div>
	<a-button
		type="primary"
		@click="selectFile"
		:loading="uploading"
		style="float: right"
		>添加附件</a-button
	>
</template>

<script setup lang="ts">
import {
	List as AList,
	ListItem as AListItem,
	Skeleton as ASkeleton,
	ListItemMeta as AListItemMeta,
	Button as AButton,
} from 'ant-design-vue';
import {
	FileExcelTwoTone,
	FileImageTwoTone,
	FilePdfTwoTone,
	FilePptTwoTone,
	FileTextTwoTone,
	FileWordTwoTone,
	FileZipTwoTone,
	FileTwoTone,
} from '@ant-design/icons-vue';
import { onMounted, ref } from 'vue';
import { useMessage } from '@lt-frame/hooks';
import { LtHttp } from '../../../configs';

const { createMessage } = useMessage();

// const emit = defineEmits(['update:open']);

const props = defineProps({
	entity: {
		type: String,
	},
	entityid: {
		type: String,
	},
});

const recParmsEntityId = ref();
const recParmsEntity = ref();

onMounted(() => {
	recParmsEntityId.value = props.entityid;
	recParmsEntity.value = props.entity;
	// 查询附件列表
	getEntityAttachments();
});

// 文件类型与对应图标的映射
const FILE_ICON_MAP = {
	pdf: FilePdfTwoTone,
	doc: FileWordTwoTone,
	docx: FileWordTwoTone,
	xls: FileExcelTwoTone,
	xlsx: FileExcelTwoTone,
	ppt: FilePptTwoTone,
	pptx: FilePptTwoTone,
	txt: FileTextTwoTone,
	gif: FileImageTwoTone,
	img: FileImageTwoTone,
	jpg: FileImageTwoTone,
	jpeg: FileImageTwoTone,
	zip: FileZipTwoTone,
	rar: FileZipTwoTone,
};

// 获取文件图标组件
const getFileIcon = (item: any) => {
	const suffix = showpic(item);
	return FILE_ICON_MAP[suffix as keyof typeof FILE_ICON_MAP] || FileTwoTone;
};

// #region 附件接口方法==========================================

function getAttachments<T = any>(entityClass: any, entityId: string) {
	return LtHttp.post<Array<T>>({
		url: 'api/attachmentService/getAttachments',
		data: [entityClass, entityId],
	});
}

function deleteAttachment<T = any>(info: T) {
	return LtHttp.post<T>({
		url: 'api/attachmentService/deleteAttachment',
		data: [info],
	});
}

function downloadAttachment<T = any>(info: T) {
	return LtHttp.post<Array<T>>(
		{
			url: 'api/attachmentService/downloadAttachment',
			data: info,
			responseType: 'blob',
		},
		{ fastjson: false, isReturnNativeResponse: true, noClearData: true }
	);
}

// #endregion==================================================

const list = ref<any[]>([]);
const initLoading = ref(true);
const loading = ref(false);

// 点击下载
async function onDownload(item: {
	attachMD5: any;
	id: any;
	attachName: any;
	attachSize: any;
}) {
	const formData = new FormData();
	formData.append('attachMD5', item.attachMD5);

	downloadAttachment(formData)
		.then((resp: any) => {
			if (resp) {
				const blob = new Blob([resp.data], {
					type: resp.headers['content-type'], // 设置文件类型
				});
				const url = window.URL.createObjectURL(blob);
				const link = document.createElement('a');
				link.href = url;
				link.setAttribute('download', item.attachName); // 设置下载文件名
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
				window.URL.revokeObjectURL(url);
			}
		})
		.finally(() => {
			loading.value = false;
		});
}

// 点击删除
function onDel(item: { id: any; attachName: any; attachSize: any }) {
	deleteAttachment(item)
		.then(() => {
			createMessage.success('删除成功');
			getEntityAttachments();
		})
		.finally(() => {
			loading.value = false;
		});
}

const fileInput = ref<HTMLInputElement | null>(null);
const selectedFile = ref<File | null>(null);
const uploading = ref(false);
const progress = ref(0);

// 添加附件按钮点击事件，触发fileInput的点击事件选择文件
function selectFile() {
	if (fileInput.value) {
		fileInput.value.click();
	}
}

// fileInput点击打开的文件框如果变换文件选择时触发
const handleFileChange = (event: Event) => {
	const target = event.target as HTMLInputElement;
	if (target.files && target.files.length > 0) {
		// eslint-disable-next-line prefer-destructuring
		selectedFile.value = target.files[0];

		if (selectedFile.value != null && selectedFile.value.size > 1000000000) {
			createMessage.error('文件大小不能超过100MB');
			return null;
		}

		if (selectedFile.value) {
			uploading.value = true;
			progress.value = 0;
			const formData = new FormData();
			formData.append('entityClass', recParmsEntity.value);
			formData.append('entityId', recParmsEntityId.value);
			formData.append('file', selectedFile.value); // 将文件添加到 FormData 中

			LtHttp.post(
				{
					url: 'api/attachmentService/uploadAttachment',
					data: formData,
					onUploadProgress: (progressEvent) => {
						if (progressEvent && progressEvent.total) {
							progress.value = Math.round(
								(progressEvent.loaded * 100) / progressEvent.total
							);
							if (progress.value === 100) {
								uploading.value = false;
							}
						}
					},
				},
				{ fastjson: false, noClearData: true }
			)
				.then((resp) => {
					if (resp) {
						createMessage.success('上传成功');
					}
					// 查询附件列表
					getEntityAttachments();
				})
				.finally(() => {
					uploading.value = false;
				});
		}
	}
};

// 附件文件根据后缀名显示不同图片
function showpic(item: any) {
	const { attachName } = item;
	// 截取文件后缀,不包含.
	const suffix = attachName.substring(attachName.lastIndexOf('.') + 1);

	return suffix;
}

// 查询附件列表
function getEntityAttachments() {
	getAttachments(recParmsEntity.value, recParmsEntityId.value)
		.then((resp) => {
			// 结果绑定在表格中
			// resultOptions.value.data = resp;
			initLoading.value = false;
			loading.value = true;
			// data.value = resp;
			list.value = resp;
		})
		.finally(() => {
			loading.value = false;
			initLoading.value = false;
		});
}

// 格式化时间
const formatDate = (timestamp: number) => {
	const date = new Date(timestamp);
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
};
</script>
