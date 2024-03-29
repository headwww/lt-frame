declare global {
	interface Window {
		LT_KEEP_LOGIN: boolean;
	}

	const process: {
		env: {
			NODE_ENV: string;
		};
	};

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
