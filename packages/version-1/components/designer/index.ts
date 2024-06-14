import { LtDatasource, LtSetterRender } from '@lt-frame/components';
import { Recordable } from '@lt-frame/utils';
import { h } from 'vue';
import FieldSetter from './components/field-setter.vue';
import VariableSetter from './components/variable-setter.vue';
import LtTable from './material/table.vue';
import { LtHttp } from '../../configs';

LtSetterRender.renderer.add('FieldSetter', {
	createSetterContent(props: Recordable) {
		return h(FieldSetter, { ...props });
	},
});

LtSetterRender.renderer.add('VariableSetter', {
	createSetterContent(props: Recordable) {
		return h(VariableSetter, { ...props });
	},
});

LtDatasource.add('公司数据源', {
	createDatasource() {
		return new Promise((resolve, reject) => {
			LtHttp.post({
				url: 'api/corpServiceImpl/findCorps',
				data: [
					{
						targetClass: 'lt.fw.core.model.biz.Corp',
						queryPath: ['code', 'name', 'type'],
					},
				],
			})
				.then((data) => {
					resolve(data);
				})
				.catch(() => {
					reject();
				});
		});
	},
});

export const LtConfigTable = LtTable;
