export class Condition {
	private targetClass?: string;

	private propertyParams?: { [key: string]: any };

	private queryPath?: string[];

	private orderBy?: string;

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
}
