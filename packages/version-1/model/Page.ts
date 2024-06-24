export interface Pager {
	pageNo?: number;
	pageSize?: number;
	rowCountEnabled?: boolean;
}

export interface PageResponse<T> {
	page: Pager;

	pageCount: number;

	pageNo: number;

	pageSize: number;

	result: T[];

	rowCount: number;
}

export class Page implements Pager {
	pageNo: number;

	pageSize: number;

	rowCountEnabled?: boolean;

	constructor(pageNo: number, pageSize: number, rowCountEnabled?: boolean) {
		this.pageNo = pageNo;
		this.pageSize = pageSize;
		this.rowCountEnabled = rowCountEnabled;
	}

	getPageNo() {
		return this.pageNo;
	}

	setPageNo(pageNo: number) {
		this.pageNo = pageNo;
	}

	getPageSize() {
		return this.pageNo;
	}

	setPageSize(pageSize: number) {
		this.pageSize = pageSize;
	}

	isRowCountEnabled() {
		return this.rowCountEnabled;
	}

	setRowCountEnabled(rowCountEnabled?: boolean) {
		this.rowCountEnabled = rowCountEnabled;
	}
}
