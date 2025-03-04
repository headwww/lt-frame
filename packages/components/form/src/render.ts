import XEUtils from 'xe-utils';
import {
	FormItemContentRenderParams,
	FormItemResetParams,
	FormItemTitleRenderParams,
} from './form-item';
import { SlotVNodeType } from './itemInfo';

/**
 * 内置的组件渲染
 */
const renderMap: { [name: string]: any } = {};

/**
 * 全局渲染器
 */
export const renderer: LtGlobalRenderer = {
	mixin(opts) {
		XEUtils.each(opts, (options, name) => renderer.add(name, options));
		return renderer;
	},
	get(name: string) {
		return renderMap[name] || null;
	},
	add(name, options) {
		if (name && options) {
			const renders = renderMap[name];
			if (renders) {
				// 检测是否覆盖
				Object.assign(renders, options);
			} else {
				renderMap[name] = options;
			}
		}
		return renderer;
	},
	delete(name) {
		delete renderMap[name];
		return renderer;
	},
};

/**
 * 渲染器
 */
export interface LtGlobalRenderer {
	mixin(options: { [name: string]: RendererOptions }): LtGlobalRenderer;
	get(
		name: string | null | undefined
	): DefineRendererOption<SlotVNodeType | SlotVNodeType[]>;
	add(name: string, options: RendererOptions): LtGlobalRenderer;
	delete(name: string): void;
}

type RendererOptions = DefineRendererOption<SlotVNodeType | SlotVNodeType[]>;

export interface DefineRendererOption<T> {
	itemClassName?:
		| string
		| ((params: FormItemTitleRenderParams) => string | Record<string, boolean>);
	itemStyle?:
		| Record<string, string | number>
		| ((params: FormItemTitleRenderParams) => Record<string, string | number>);
	itemContentClassName?:
		| string
		| ((params: FormItemTitleRenderParams) => string | Record<string, boolean>);
	itemContentStyle?:
		| Record<string, string | number>
		| ((params: FormItemTitleRenderParams) => Record<string, string | number>);
	itemTitleClassName?:
		| string
		| ((params: FormItemTitleRenderParams) => string | Record<string, boolean>);
	itemTitleStyle?:
		| Record<string, string | number>
		| ((params: FormItemTitleRenderParams) => Record<string, string | number>);
	renderItemContent?(
		renderOpts: RenderOptions,
		params: FormItemContentRenderParams
	): T;
	renderItemTitle?(
		renderOpts: RenderOptions,
		params: FormItemTitleRenderParams
	): T;
	itemVisibleMethod?(params: FormItemTitleRenderParams): boolean;
	itemResetMethod?(params: FormItemResetParams): void;

	autofocus?: string;
}

/**
 * 渲染选项
 */
export interface RenderOptions {
	/**
	 * 渲染器名称
	 */
	name?: string;
	/**
	 * 目标组件渲染的参数
	 */
	props?: { [key: string]: any };
	/**
	 * 目标组件渲染的属性
	 */
	attrs?: { [key: string]: any };
	/**
	 * 目标组件渲染的事件
	 */
	events?: { [key: string]: (...args: any[]) => any };

	/**
	 * 如果指定了聚焦 class
	 */
	autofocus?: string;
}

export const LtRender = {
	renderer,
};
