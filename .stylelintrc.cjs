module.exports = {
	extends: ['stylelint-config-standard',"stylelint-config-recommended-less","stylelint-config-recommended-vue"],
	overrides: [
		{
			files: ['*.less', '**/*.less'],
			customSyntax: 'postcss-less',
			extends: ['stylelint-config-recommended-less'],
		},
	],
};