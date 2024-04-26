const doc = window.document;
let copyElem: HTMLTextAreaElement;

export function handleText(content: string | number) {
	if (!copyElem) {
		copyElem = doc.createElement('textarea');
		copyElem.id = '$XECopy';
		const styles = copyElem.style;
		styles.width = '48px';
		styles.height = '24px';
		styles.position = 'fixed';
		styles.zIndex = '0';
		styles.left = '-500px';
		styles.top = '-500px';
		doc.body.appendChild(copyElem);
	}
	copyElem.value =
		content === null || content === undefined ? '' : `${content}`;
}

export function copyText(content: string | number): boolean {
	let result = false;
	try {
		handleText(content);
		copyElem.select();
		copyElem.setSelectionRange(0, copyElem.value.length);
		result = doc.execCommand('copy');
		copyElem.blur();
	} catch (e) {
		//
	}
	return result;
}
