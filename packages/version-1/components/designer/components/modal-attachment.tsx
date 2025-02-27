import { useMessage } from '@lt-frame/hooks';
import { Modal } from 'ant-design-vue';
import Attachments from './attachments.vue';

const { createMessage } = useMessage();

export const showAttachment = (options?: any) => {
	if (!options) {
		return;
	}

	const currentRecord = options.tableRef.getCurrentRecord();

	if (!currentRecord) {
		createMessage.warning('请选择一条记录');
		return;
	}
	if (!options.tableConfig) {
		createMessage.warning('请设置表配置');
		return;
	}

	Modal.confirm({
		title: '附件管理',
		icon: null,
		centered: true,
		width: 800,
		closable: true,
		content: () => (
			<Attachments
				entity={options.tableConfig.entity}
				entityid={currentRecord.id}
			></Attachments>
		),
		footer: null,
	});
};
