type UserParam = {
	name: string;
	value: any;
	type?: string;
};

export class Condition {
	private targetClass?: string;

	private propertyParams?: { [key: string]: any };

	private expression?: string;

	private ordinalParams?: any[];

	private queryPath?: string[];

	private orderBy?: string;

	private userParams?: UserParam[];

	constructor(targetClass?: string) {
		this.targetClass = targetClass;
	}

	setTargetClass(targetClass: string): Condition {
		this.targetClass = targetClass;
		return this;
	}

	getTargetClass() {
		return this.targetClass;
	}

	prop(property: string, value: any): Condition {
		if (!this.propertyParams) {
			this.propertyParams = {};
		}
		this.propertyParams[property] = value;
		return this;
	}

	expr(expression: string, ...params: any[]): Condition {
		if (this.expression == null) {
			this.expression = expression;
		} else {
			this.expression = `(${this.expression}) and (${expression})`;
		}
		if (this.ordinalParams == null) {
			this.ordinalParams = [];
		}
		this.ordinalParams.push(...params);
		return this;
	}

	addQueryPath(...path: string[]): Condition {
		if (!this.queryPath) {
			this.queryPath = [] as string[];
		}
		this.queryPath.push(...path);
		return this;
	}

	orderByAsc(property: string): Condition {
		if (this.orderBy == null) this.orderBy = `this.${property}`;
		else this.orderBy += `,this.${property}`;
		return this;
	}

	orderByDesc(property: string): Condition {
		if (this.orderBy == null) this.orderBy = `this.${property} desc`;
		else this.orderBy += `,this.${property} desc`;
		return this;
	}

	addUserParam(name: string, value: any, type?: string): Condition {
		if (this.userParams == null) {
			this.userParams = [];
		}
		this.userParams.push({ name, value, type });
		return this;
	}
}
