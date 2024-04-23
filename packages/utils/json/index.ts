import { isObject } from 'lodash-es';
import { Recordable } from '../types';

export function parseRef(root: any): any {
	if (!isObject(root)) {
		return root;
	}

	process(null, null, null, root);
	function process(
		parent: Recordable | null,
		current: Recordable | null,
		fieldName: string | number | null,
		object: Recordable
	) {
		for (const key in object) {
			if (Object.hasOwnProperty.call(object, key)) {
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
					current!![fieldName!!] = refValue;
				}
			}
		}
	}

	function resolveRef(ref: string): object {
		let value = root;
		const parts = ref.split(/[.[\]]+/);

		for (let i = 1; i < parts.length; i++) {
			// 从索引1开始，0是$
			const key = parts[i];

			if (!key) continue;

			value = value[key];

			// if (!isNaN(Number(key))) {
			// 	// 非数字
			// 	console.log(key, isNaN(Number(key)));

			// } else {
			// 	console.log(key, isNaN(Number(key)), value[key]);

			// 	value = value[key];
			// }
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
