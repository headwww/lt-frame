import { IDesigner } from './designer';

export class Dragon {
	constructor(readonly designer: IDesigner) {
		designer;
	}

	from(shell: Element, boost?: (e: MouseEvent) => any | null) {
		const mousedown = (e: MouseEvent) => {
			// 排除右键点击和右键
			if (e.which === 3 || e.button === 2) {
				return;
			}
			if (boost) {
				const dragObject = boost(e);
				this.boost(dragObject, e);
			}
		};

		shell.addEventListener('mousedown', mousedown as any);
		return () => {
			shell.removeEventListener('mousedown', mousedown as any);
		};
	}

	boost(dragObject: any, e: MouseEvent | DragEvent) {
		console.log(dragObject, e);
	}

	getMasterSensors() {}
}
