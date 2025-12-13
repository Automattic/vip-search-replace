const { configs } = require( '@automattic/eslint-plugin-wpvip' );

const config = [
	{
		ignores: [ 'node_modules/**' ],
	},
	...configs.recommended,
	...configs.cli,
	...configs.testing,
	{
		rules: {
			'no-console': 'off',
		},
		linterOptions: {
			reportUnusedDisableDirectives: 'warn',
		},
	},
];

module.exports = config;
