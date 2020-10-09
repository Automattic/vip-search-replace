const https = require( 'https' );
const gunzip = require( 'zlib' ).createGunzip();
const fs = require( 'fs' );
const path = require( 'path' );
const debug = require( 'debug' )( 'vip-search-replace:install-go-binary' );

// ours
const pkg = require( '../package.json' );

// Ensure build path exists
const binPath = path.join( process.cwd(), 'bin', 'go-search-replace' );
debug( binPath );
if ( ! fs.existsSync( path.dirname( binPath ) ) ) {
	fs.mkdirSync( path.dirname( binPath ) );
}

// Config
const URL = 'https://github.com/Automattic/go-search-replace/releases/download/{{version}}/go-search-replace_{{platform}}_{{arch}}.gz';

// Mapping from Node's `process.arch` to Golang's `$GOARCH`
const ARCH_MAPPING = {
	ia32: '386',
	x64: 'amd64',
	arm: 'arm',
};

// Mapping between Node's `process.platform` to Golang's
const PLATFORM_MAPPING = {
	darwin: 'darwin',
	linux: 'linux',
	win32: 'windows',
	freebsd: 'freebsd',
};

// Windows executables compiled by Golang have a `.exe` extension
let arch = ARCH_MAPPING[ process.arch ];
if ( process.platform === 'win32' ) {
	arch += '.exe';
}

const url = URL
	.replace( /{{arch}}/, arch )
	.replace( /{{platform}}/, PLATFORM_MAPPING[ process.platform ] )
	.replace( /{{version}}/, pkg.goBinaryVersion );

// Helper function to follow redirects
const download = function( newUrl = null ) {
	const currentUrl = newUrl || url;
	debug( 'Current URL: ', currentUrl );
	return new Promise( ( resolve, reject ) => {
		https.request( currentUrl, async res => {
			debug( 'StatusCode: ', res.statusCode );

			if ( res.statusCode >= 300 && res.statusCode < 400 ) {
				debug( 'Redirecting to:', res.headers.location );
				await download( res.headers.location );
				resolve();
			} else {
				const writeStream = fs.createWriteStream( binPath, { mode: 0o755 } );
				writeStream.on( 'error', writeErr => {
					console.error( writeErr );
					reject( writeErr );
				} );
				writeStream.on( 'finish', () => {
					resolve( 'done' );
				} );
				res.pipe( gunzip ).pipe( writeStream );
			}
		} )
			.on( 'error', err => {
				debug( 'ERROR:', err );
				reject( err );
			} )
			.end();
	} );
};

module.exports = download;
