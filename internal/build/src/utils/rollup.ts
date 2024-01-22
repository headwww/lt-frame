import type { OutputOptions, RollupBuild } from 'rollup';
import { epPackage } from './paths';
import { getPackageDependencies } from './pkg';

/**
 * 排除一些外部依赖，需要在packages/lt-frame中配置
 * @param options
 * @returns
 */
export const generateExternal = async (options: { full: boolean }) => {
	const { dependencies, peerDependencies } = getPackageDependencies(epPackage);
	return (id: string) => {
		const packages: string[] = [...peerDependencies];
		if (!options.full) {
			packages.push('@vue', ...dependencies);
		}
		return [...new Set(packages)].some(
			(pkg) => id === pkg || id.startsWith(`${pkg}/`)
		);
	};
};

export function writeBundles(bundle: RollupBuild, options: OutputOptions[]) {
	return Promise.all(options.map((option) => bundle.write(option)));
}
