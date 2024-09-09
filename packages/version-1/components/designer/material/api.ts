import { Condition } from '@lt-frame/utils';
import { LtHttp } from '../../../configs';

export function findBsConfigTables(tUid?: string) {
	const condition = new Condition();
	condition.setTargetClass('test.app.model.BsConfigTable');
	condition.prop('tUid', tUid);
	return LtHttp.post({
		url: 'api/bsConfigServiceImpl/findBsConfigTables',
		data: [condition],
	});
}

export function saveBsConfigTablesByString(data: any) {
	return LtHttp.post({
		url: 'api/bsConfigServiceImpl/saveBsConfigTablesByString',
		data: [data],
	});
}

export function getUserTablePermissionListByTable(tUid: string) {
	return LtHttp.post({
		url: 'api/bsTablePermissionService/getUserTablePermissionListByTable',
		data: [tUid?.split('_')[0], tUid],
	});
}
