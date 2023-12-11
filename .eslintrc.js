require( '@automattic/eslint-plugin-wpvip/init' );

module.exports = {
	extends: [
		'plugin:@automattic/wpvip/recommended',
		'plugin:@automattic/wpvip/cli',
		'plugin:@automattic/wpvip/testing',
	],
	rules: {
		'no-console': 'off',
	},
	root: true,
	env: {
		node: true,
		jest: true,
	},
};
