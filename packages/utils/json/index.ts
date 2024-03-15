// TODO: 和后端沟通处理好数据再给我
import { isNaN } from 'lodash-es';

// @ts-ignore: type unless
function isObject(value): boolean {
	return value != null && typeof value === 'object';
}

export function parseRef(root: any): any {
	if (!isObject(root)) {
		return root;
	}
	// @ts-ignore: type unless
	process(null, null, null, root);
	function process(
		parent: object,
		current: object,
		fieldName: string | number,
		object: object
	) {
		// eslint-disable-next-line no-restricted-syntax
		for (const key in object) {
			// eslint-disable-next-line no-prototype-builtins
			if (object.hasOwnProperty(key)) {
				// @ts-ignore: type unless
				const value = object[key];
				if (isObject(value)) {
					process(current, object, key, value);
				} else if (key === '$ref') {
					let refValue;
					if (value === '$') {
						// root
						refValue = root;
					} else if (value === '@') {
						// 本身
						refValue = current;
					} else if (value === '..') {
						refValue = parent;
					} else {
						refValue = resolveRef(value);
					}
					// @ts-ignore: type unless
					current[fieldName] = refValue;
				}
			}
		}
	}

	function resolveRef(ref: string): object {
		let value = root;
		const parts = ref.split(/[.[\]]+/);
		// eslint-disable-next-line no-plusplus
		for (let i = 1; i < parts.length; i++) {
			// 从索引1开始，0是$
			const key = parts[i];
			// eslint-disable-next-line no-continue
			if (!key) continue;
			if (isNaN(key as any)) {
				// 非数字
				value = value[key];
			} else {
				// eslint-disable-next-line radix
				value = value[parseInt(key)];
			}
		}
		return value;
	}

	return JSON.parse(JSON.stringify(root));
}

// export function serializeRef(root: any): any {
//   if (!isObject(root)) {
//     return root
//   }

//   let references = new Map<object, SerialContext>()
//   process(null, null, null, root)

//   function process(parent: object, current: object, fieldName: string | number, object: object) {
//     if (object == current) {
//       current[fieldName] = { $ref: '@' }
//     } else if (object == parent) {
//       current[fieldName] = { $ref: '..' }
//     } else if (object == root) {
//       current[fieldName] = { $ref: '$' }
//     } else if (references.has(object)) {
//       let path = references.get(object).tostring()
//       current[fieldName] = { $ref: `${path}` }
//     } else {
//       references.set(object, new SerialContext(references.get(current), fieldName, object))
//       for (let key in object) {
//         let value = object[key]
//         if (!isObject(value)) {
//           continue
//         }
//         process(current, object, key, value)
//       }
//     }
//   }

//   return root
// }

// class SerialContext {
//   parent: SerialContext
//   fieldName: string | number
//   object: object

//   constructor(parent: SerialContext, fieldName: string | number, object: object) {
//     this.parent = parent
//     this.fieldName = fieldName
//     this.object = object
//   }

//   tostring(): string {
//     if (parent == null) {
//       return '$'
//     } else {
//       let result: string = ''
//       if (typeof this.fieldName == 'number') {
//         result += '['
//         result += this.fieldName
//         result += ']'
//       } else {
//         result += '.'
//         result += this.fieldName
//       }
//       return result
//     }
//   }
// }
