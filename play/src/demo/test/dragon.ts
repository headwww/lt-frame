interface DragObject {
	nodes: any[]; // 拖拽的节点数据
}

export class SimpleDragon {
	private isDragging: boolean = false;

	private dragObject?: DragObject;

	onDragStart(callback: (e: DragEvent) => void) {
		// 触发拖拽开始事件
		document.addEventListener('dragstart', (e) => {
			this.isDragging = true;
			callback(e);
		});
	}

	onDrag(callback: (e: DragEvent) => void) {
		// 触发拖拽中事件
		document.addEventListener('drag', (e) => {
			if (this.isDragging) {
				callback(e);
			}
		});
	}

	onDragEnd(callback: (e: DragEvent) => void) {
		// 触发拖拽结束事件
		document.addEventListener('dragend', (e) => {
			this.isDragging = false;
			callback(e);
			this.dragObject = undefined; // 重置拖拽对象
		});
	}

	startDrag(dragObject: DragObject) {
		this.dragObject = dragObject;
		// 可以在这里设置拖拽效果等
	}

	drag(e: DragEvent) {
		// 可在此处理拖拽过程中的逻辑
		console.log(e);
	}

	drop(e: DragEvent) {
		// 处理放置逻辑
		e.preventDefault();
		if (this.dragObject) {
			console.log('Dropped:', this.dragObject);
			// 处理拖拽的对象放置到目标位置的逻辑
		}
	}
}
