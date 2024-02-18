declare global {
	namespace JSX {
		type Element = VNode;
		type ElementClass = ComponentRenderProxy;
		interface ElementAttributesProperty {
			$props: any;
		}
		interface IntrinsicElements {
			[elem: string]: any;
		}
		interface IntrinsicAttributes {
			[elem: string]: any;
		}
	}
}

export {};
