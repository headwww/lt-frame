import type { Plugin } from 'rollup';

export function LTFrameAlias(): Plugin {
	const themeChalk = 'theme-chalk';
	const sourceThemeChalk = `@lt-frame/${themeChalk}` as const;
	const bundleThemeChalk = `lt-frame/${themeChalk}` as const;
	return {
		name: 'element-plus-alias-plugin',
		resolveId(id) {
			if (!id.startsWith(sourceThemeChalk)) return;
			return {
				id: id.replaceAll(sourceThemeChalk, bundleThemeChalk),
				external: 'absolute',
			};
		},
	};
}
