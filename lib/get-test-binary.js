const path = require( 'path' );

const { downloadBinary } = require( './install-go-binary' );

( async () => {
	const arch = 'amd64';
	const platform = 'linux';
	const latestBinaryVersion = '0.0.5';
	const URL = 'https://github.com/Automattic/go-search-replace/releases/download/{{version}}/go-search-replace_{{platform}}_{{arch}}.gz';

	const url = URL
		.replace( /{{arch}}/, arch )
		.replace( /{{platform}}/, platform )
		.replace( /{{version}}/, latestBinaryVersion );

	const writePath = path.join( process.cwd(), 'bin', 'go-search-replace-test' );

	await downloadBinary( url, writePath );
} )();
