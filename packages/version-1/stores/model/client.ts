interface Employee {
	code: string;
	corp: Corp;
	dept: Dept;
	version: number;
	name: string;
	id: string;
}
interface Dept {
	code: string;
	updatedBy: string;
	corp: Corp;
	created: number;
	version: number;
	createdBy: string;
	name: string;
	id: string;
	treeCode: string;
	updated: number;
}

interface User {
	corp: Corp;
	created: number;
	createdBy: string;
	employee: Employee;
	id: string;
	password: string;
	status: string;
	updated: number;
	updatedBy: string;
	username: string;
	version: number;
}

interface Corp {
	code: string;
	type: string;
	version: number;
	name: string;
	id: string;
	treeCode: string;
}

export interface Client {
	clientTypeName?: string;
	corp?: Corp;
	loginTime?: number;
	remoteAddr?: string;
	user?: User;
}
