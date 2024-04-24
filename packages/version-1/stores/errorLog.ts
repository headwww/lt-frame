import { Nullable, formatToDateTime } from '@lt-frame/utils';
import { defineStore } from 'pinia';
import { ErrorLogInfo, ErrorTypeEnum } from '../error/types';

export interface ErrorLogState {
	errorLogInfoList: Nullable<ErrorLogInfo[]>;
	errorLogListCount: number;
}

export const useErrorLogStore = defineStore({
	id: 'lt-error-log',
	state: (): ErrorLogState => ({
		errorLogInfoList: null,
		errorLogListCount: 0,
	}),
	getters: {
		getErrorLogInfoList(state): ErrorLogInfo[] {
			return state.errorLogInfoList || [];
		},
		getErrorLogListCount(state): number {
			return state.errorLogListCount;
		},
	},
	actions: {
		addErrorLogInfo(info: ErrorLogInfo) {
			const item = {
				...info,
				time: formatToDateTime(new Date()),
			};
			this.errorLogInfoList = [item, ...(this.errorLogInfoList || [])];
			this.errorLogListCount += 1;
		},

		setErrorLogListCount(count: number): void {
			this.errorLogListCount = count;
		},

		/**
		 * Triggered after ajax request error
		 * @param error
		 * @returns
		 */
		addAjaxErrorInfo(error: any) {
			const errInfo: Partial<ErrorLogInfo> = {
				message: error.message,
				type: ErrorTypeEnum.AJAX,
			};
			if (error.response) {
				const {
					config: {
						url = '',
						data: params = '',
						method = 'get',
						headers = {},
					} = {},
					data = {},
				} = error.response;
				errInfo.url = url;
				errInfo.name = 'Ajax Error!';
				errInfo.file = '-';
				errInfo.stack = JSON.stringify(data);
				errInfo.detail = JSON.stringify({ params, method, headers });
			}
			this.addErrorLogInfo(errInfo as ErrorLogInfo);
		},
	},
});
