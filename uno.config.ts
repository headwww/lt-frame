import { defineConfig, presetTypography, presetUno } from 'unocss';
import type { UserConfig } from 'unocss';

const config: UserConfig = defineConfig({
	presets: [presetUno(), presetTypography()],
});

export default config;
