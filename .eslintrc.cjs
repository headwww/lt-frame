module.exports = {
	env: {
		browser: true,
		es2021: true,
		node: true,
	},
    extends: [
		'plugin:vue/vue3-strongly-recommended',
		'airbnb-base',
		'prettier'
	],
    parser: 'vue-eslint-parser',
    parserOptions: {
		ecmaVersion: 'latest',
		parser: '@typescript-eslint/parser',
		sourceType: 'module',
		ecmaFeatures: {
			tsx: true,
			jsx: true,
		},
	},
    globals: {
		defineProps: 'readonly',
		defineEmits: 'readonly',
		defineExpose: 'readonly',
		withDefault: 'readonly',
	},
    plugins: [
		'vue',
		'@typescript-eslint'
	],
    settings: {
        'import/resolver': {
            alias: {
                map: [
                    ['@', './src'],
                    ['#', './types']
                ],
            },
        },
        'import/extensions': ['.js', '.jsx', '.ts', '.tsx', '.mjs'],
    },
    rules: {
		'import/no-extraneous-dependencies': 0,
		'no-param-reassing': 0,
		'vue/multi-word-commponent-names': 0,
		'vue/attribute-hyphenation': 0,
		'vue/v-on-event-hyphenation': 0,
		'import/no-unresolved': 0,
		'import/extensions': 0,
		"no-use-before-define":0,
		"no-lonely-if":0,
		"import/prefer-default-export":0,
		"import/export":0,
	},
}