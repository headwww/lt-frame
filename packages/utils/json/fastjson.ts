import { isObject } from 'xe-utils';
import { isNull } from 'lodash-es';
import { Recordable } from '../types';

export function parse(root: any): any {
	if (!isObject(root)) {
		return root;
	}

	const newRoot: any = Array.isArray(root) ? [] : {};

	Object.keys(root).forEach((key) => {
		process(null, root, key, newRoot);
	});

	function process(
		parent: Recordable | null,
		current: Recordable,
		fieldName: string,
		newCurrent: Recordable
	) {
		const fieldValue: Recordable = current[fieldName];

		// 添加对null的检查
		if (fieldValue === null) {
			newCurrent[fieldName] = null;
			return;
		}

		if (!isObject(fieldValue)) {
			newCurrent[fieldName] = fieldValue;
		} else if (fieldValue.$ref) {
			const value = fieldValue.$ref;
			let refValue: any;
			if (value === '$') {
				// root
				refValue = root;
			} else if (value === '@') {
				// 本身
				refValue = current;
			} else if (value === '..') {
				// 父亲
				refValue = parent;
			} else {
				// refValue = resolveRef(value); 改用下面更简便的方法
				const paths = (value as string).split(/[.[\]]+/);
				paths.shift(); // 从数组中移除第一个元素：$
				refValue = paths.reduce((value, key) => value[key], newRoot);
			}
			newCurrent[fieldName] = refValue;
		} else {
			const newFieldValue = Array.isArray(fieldValue) ? [] : {};
			newCurrent[fieldName] = newFieldValue;
			Object.keys(fieldValue).forEach((key) => {
				process(current, fieldValue, key, newFieldValue);
			});
		}
	}
	return newRoot;
}

const json = {
	parameters: [
		[
			{
				auxQuantity: 999999.0,
				batch: '无',
				bom: {
					$$proxy$$: '',
					finishedRate: 1,
					property: 'SCBOM',
					id: '690943254614507520',
					createDate: 1732604270545,
					isInvalid: false,
					priority: 1,
					versionDate: 1732604270545,
					isDefault: false,
					status: 'UNAUDIT',
				},
				created: 1650009431355,
				createdBy: '罗东',
				distributQuantity: 500000,
				endDate: 1650009391718,
				goods: {
					belong: 'FB',
					checkDate: 1677577987462,
					checker: {
						id: '1',
						$$proxy$$: '',
					},
					code: '60081249',
					corpGoods: {
						abc: 'A',
						aheadPeriod: 0,
						apsType: 'ORDER',
						availableQuantity: 0,
						cycleStock: 0,
						feedOut: 'NO',
						fifo: 'NOCONTROL',
						finishRate: 0,
						fixtureAhead: 0,
						grossRate: 0,
						grossWeight: 0,
						height: 0,
						highestPrice: 0,
						isAp: false,
						isApExpand: true,
						isAs: false,
						isBackflush: false,
						isBarcode: false,
						isBatch: false,
						isCheck: false,
						isConfig: false,
						isCurrentStore: true,
						isDistribute: true,
						isEasily: false,
						isEntrusted: false,
						isFeed: true,
						isFeedOut: false,
						isFinished: false,
						isImportant: false,
						isInvalid: false,
						isMPS: false,
						isMultiVersion: false,
						isOrder: false,
						isOrderMerge: false,
						isOutsourced: false,
						isPart: false,
						isPlan: true,
						isPlanWhole: true,
						isProductBarcode: false,
						isProject: false,
						isPurchased: false,
						isQualityPeriod: false,
						isReplace: false,
						isSelfmaked: false,
						isSerial: false,
						isSpecial: false,
						isVirtual: false,
						isWhole: false,
						length: 0,
						lowCode: 0,
						mergeNumber: 0,
						minOrder: 0,
						minPack: 0,
						monthUsage: 0,
						mpsCycleStock: 0,
						mpsMinOrder: 0,
						mpsMinPack: 0,
						mpsSafeQuantity: 0,
						netWeight: 0,
						operatLowCode: 0,
						outMin: 0,
						outParameter: 'CONTROL',
						outPut: 0,
						outRate: 0,
						planQuantity: 0,
						positionFifo: 'NOCONTROL',
						priceOption: 'TRANSACTION_PRICE',
						productInRate: 0,
						productTime: 0,
						qualityTime: 0,
						receiveRate: 0,
						safeDelayDay: 0,
						safeQuantity: 0,
						splitBatch: 0,
						sustainPeriod: 1,
						sustainPolicy: 'PERIOD',
						targeLife: 0,
						timeUnit: 'DAY',
						totalTargeLife: 0,
						totalWarnLife: 0,
						unitPrice: 0,
						variationAhead: 0,
						variationBasic: 1,
						volume: 0,
						warnLife: 0,
						width: 0,
					},
					createDate: 1654583717449,
					created: 1654583767845,
					createdBy: '系统管理员',
					factoryGoods: {
						cycleStock: 0,
						isPlanConstraint: true,
						maxQuantity: 0,
						minQuantity: 0,
						mpsCycleStock: 0,
						mpsMinOrder: 0,
						mpsMinPack: 0,
						mpsSafeQuantity: 0,
						safeDelayDay: 0,
						safeQuantity: 0,
						splitBatch: 0,
						storeQuantity: 0,
					},
					fullName:
						'POY\\282/144 SK00 SA0001 PET再生(半消光) PET-Recycle-SD 150D/144F',
					goodsType: {
						isCanModify: false,
						$$proxy$$: '',
						lengths: 3,
						isAutoCode: false,
						id: '489044182627782657',
					},
					id: '689538440810725413',
					isInvalid: false,
					mainUnit: 'KG',
					maker: {
						$ref: '$.parameters[0][0].goods.checker',
					},
					measure: 0,
					measureMode: 'ZERO',
					modulus: 1,
					name: 'SA0001',
					priceMethod: false,
					property: 'WL',
					standards: '282/144PSK00',
					status: 'AUDITED',
					taxRate: 0.17,
					updated: 1677577987462,
					updatedBy: '系统管理员',
					version: 4,
				},
				id: '699649465170001920',
				inQuantity: 0,
				isClose: false,
				isEndPosition: true,
				itemCode: '无',
				mainQuantity: 999999,
				parent: {
					checkDate: 1650009465778,
					checker: {
						id: '669131237415190571',
						$$proxy$$: '',
					},
					code: 'SCDD2022041500002',
					corp: {
						type: 'SUBSIDIARY',
						$$proxy$$: '',
						id: '716609843271565312',
					},
					createDate: 1650009423500,
					created: 1650009431298,
					createdBy: '罗东',
					date: 1650009423000,
					dept: {
						id: '667759966777507847',
						$$proxy$$: '',
					},
					factory: {
						type: 'SUBSIDIARY',
						$$proxy$$: '',
						id: '716609927673544704',
					},
					id: '699649464930926592',
					isClose: true,
					isLock: true,
					isSubmit: true,
					maker: {
						$ref: '$.parameters[0][0].parent.checker',
					},
					process: {
						isNegative: false,
						flag: 'PROCESS',
						isEnd: true,
						$$proxy$$: '',
						isBottleneck: false,
						compressPeriod: 0,
						id: '669553689303711745',
					},
					property: 'PC',
					source: 'BY_PRO_PLAN',
					status: 'AUDITED',
					updated: 1732528437924,
					updatedBy: '系统管理员',
					version: 12,
				},
				position: {
					isNegative: false,
					flag: 'PROCESS',
					isEnd: true,
					$$proxy$$: '',
					isBottleneck: false,
					compressPeriod: 0,
					id: '669553689303711746',
				},
				process: {
					$ref: '$.parameters[0][0].parent.process',
				},
				productPlanLine: {
					auxQuantity: 999999.0,
					batch: '无',
					bom: {
						$ref: '$.parameters[0][0].bom',
					},
					created: 1650009415682,
					createdBy: '罗东',
					equipment: null,
					executeStatus: 'EXECUTE',
					goods: {
						belong: 'FB',
						checkDate: 1677577987462,
						checker: null,
						code: '60081249',
						corpGoods: {
							abc: 'A',
							aheadPeriod: 0,
							apsType: 'ORDER',
							availableQuantity: 0,
							cycleStock: 0,
							feedOut: 'NO',
							fifo: 'NOCONTROL',
							finishRate: 0,
							fixtureAhead: 0,
							grossRate: 0,
							grossWeight: 0,
							height: 0,
							highestPrice: 0,
							isAp: false,
							isApExpand: true,
							isAs: false,
							isBackflush: false,
							isBarcode: false,
							isBatch: false,
							isCheck: false,
							isConfig: false,
							isCurrentStore: true,
							isDistribute: true,
							isEasily: false,
							isEntrusted: false,
							isFeed: true,
							isFeedOut: false,
							isFinished: false,
							isImportant: false,
							isInvalid: false,
							isMPS: false,
							isMultiVersion: false,
							isOrder: false,
							isOrderMerge: false,
							isOutsourced: false,
							isPart: false,
							isPlan: true,
							isPlanWhole: true,
							isProductBarcode: false,
							isProject: false,
							isPurchased: false,
							isQualityPeriod: false,
							isReplace: false,
							isSelfmaked: false,
							isSerial: false,
							isSpecial: false,
							isVirtual: false,
							isWhole: false,
							length: 0,
							lowCode: 0,
							mergeNumber: 0,
							minOrder: 0,
							minPack: 0,
							monthUsage: 0,
							mpsCycleStock: 0,
							mpsMinOrder: 0,
							mpsMinPack: 0,
							mpsSafeQuantity: 0,
							netWeight: 0,
							operatLowCode: 0,
							outMin: 0,
							outParameter: 'CONTROL',
							outPut: 0,
							outRate: 0,
							planQuantity: 0,
							positionFifo: 'NOCONTROL',
							priceOption: 'TRANSACTION_PRICE',
							productInRate: 0,
							productTime: 0,
							qualityTime: 0,
							receiveRate: 0,
							safeDelayDay: 0,
							safeQuantity: 0,
							splitBatch: 0,
							sustainPeriod: 1,
							sustainPolicy: 'PERIOD',
							targeLife: 0,
							timeUnit: 'DAY',
							totalTargeLife: 0,
							totalWarnLife: 0,
							unitPrice: 0,
							variationAhead: 0,
							variationBasic: 1,
							volume: 0,
							warnLife: 0,
							width: 0,
						},
						createDate: 1654583717449,
						created: 1654583767845,
						createdBy: '系统管理员',
						factoryGoods: {
							cycleStock: 0,
							isPlanConstraint: true,
							maxQuantity: 0,
							minQuantity: 0,
							mpsCycleStock: 0,
							mpsMinOrder: 0,
							mpsMinPack: 0,
							mpsSafeQuantity: 0,
							safeDelayDay: 0,
							safeQuantity: 0,
							splitBatch: 0,
							storeQuantity: 0,
						},
						fullName:
							'POY\\282/144 SK00 SA0001 PET再生(半消光) PET-Recycle-SD 150D/144F',
						goodsType: null,
						id: '689538440810725413',
						isInvalid: false,
						mainUnit: 'KG',
						maker: null,
						measure: 0,
						measureMode: 'ZERO',
						modulus: 1,
						name: 'SA0001',
						priceMethod: false,
						property: 'WL',
						standards: '282/144PSK00',
						status: 'AUDITED',
						taxRate: 0.17,
						updated: 1677577987462,
						updatedBy: '系统管理员',
						version: 4,
					},
					id: '699649399432675328',
					isEndPosition: true,
					isLock: false,
					itemCode: '无',
					mainQuantity: 999999,
					mrpQuantity: 0,
					needDate: 1650009391718,
					orderQuantity: 999999,
					parent: null,
					position: {
						$ref: '$.parameters[0][0].position',
					},
					process: {
						$ref: '$.parameters[0][0].parent.process',
					},
					productQuantity: 0,
					pushedQuantity: 90,
					releaseDate: 1650009391718,
					startDate: 1650009391718,
					status: 'AUDITED',
					updated: 1732604275711,
					updatedBy: '系统管理员',
					version: 53,
					workCenter: {
						$$proxy$$: '',
						property: false,
						id: '669534760762081280',
					},
				},
				pushedFinishQuantity: 90,
				startDate: 1650009391718,
				updated: 1732604275701,
				updatedBy: '系统管理员',
				version: 39,
				workCenter: {
					$ref: '$.parameters[0][0].productPlanLine.workCenter',
				},
			},
		],
	],
	success: true,
};

console.log(parse(json));

/**
 * 将json对象转换为fastjson格式，生成$ref
 * @param root
 */
export function serialize(root: any): any {
	if (!isObject(root)) {
		return root;
	}

	const map: Map<any, String> = new Map();
	map.set(root, '$');

	const newRoot = Array.isArray(root) ? [] : {};

	Object.keys(root).forEach((key) => {
		process(null, root, '$', key, newRoot);
	});

	function process(
		parent: any,
		current: Recordable,
		basePath: string,
		fieldName: string | number,
		newCurrent: Recordable
	): any {
		const fieldValue = current[fieldName];
		if (!isObject(fieldValue)) {
			newCurrent[fieldName] = fieldValue;
		} else if (fieldValue === current) {
			newCurrent[fieldName] = { $ref: '@' };
		} else if (fieldValue === parent) {
			newCurrent[fieldName] = { $ref: '..' };
		} else if (map.has(fieldValue)) {
			newCurrent[fieldName] = { $ref: map.get(fieldValue) };
		} else if (isNull(fieldValue)) {
			newCurrent[fieldName] = null;
		} else {
			const endPath = Array.isArray(current)
				? `[${fieldName}]`
				: `.${fieldName}`;
			const path = `${basePath}${endPath}`;
			if (fieldValue) {
				map.set(fieldValue, path);
			}

			const newFieldValue = Array.isArray(fieldValue) ? [] : {};
			newCurrent[fieldName] = newFieldValue;
			Object.keys(fieldValue).forEach((key) => {
				process(current, fieldValue, path, key, newFieldValue);
			});
		}
	}

	return newRoot;
}
