/*
 * MIT License
 *
 * Copyright (c) 2021 Automattic
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
const { https } = require( 'follow-redirects' );
const gunzip = require( 'zlib' ).createGunzip();
const fs = require( 'fs' );
const path = require( 'path' );
const debug = require( 'debug' )( 'vip-search-replace:install-go-binary' );

// Ensure build path exists
const binPath = path.join( process.cwd(), 'bin', 'go-search-replace' );
debug( binPath );
if ( ! fs.existsSync( path.dirname( binPath ) ) ) {
	fs.mkdirSync( path.dirname( binPath ) );
}

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

function getLatestReleaseUrlForPlatformAndArch() {
	// Windows executables compiled by Golang have a `.exe` extension
	const arch = `${ ARCH_MAPPING[ process.arch ] }${ process.platform === 'win32' ? '.exe' : '' }`;

	return 'https://github.com/Automattic/go-search-replace/releases/latest/download/go-search-replace_{{platform}}_{{arch}}.gz'
		.replace( /{{arch}}/, arch )
		.replace( /{{platform}}/, PLATFORM_MAPPING[ process.platform ] );
}

const downloadBinary = ( url = getLatestReleaseUrlForPlatformAndArch(), writePath = null ) => {
	return new Promise( ( resolve, reject ) => {
		debug( 'Requested URL: ', url );
		https.request( url, res => {
			debug( JSON.stringify( { statusCode: res.statusCode, responseUrl: res.responseUrl } ) );
			const writeTo = writePath || binPath;
			const writeStream = fs.createWriteStream( writeTo, { mode: 0o755 } );
			writeStream.on( 'error', writeErr => {
				console.error( writeErr );
				reject( writeErr );
			} );
			writeStream.on( 'finish', () => {
				debug( `Downloaded & unpacked binary to path: ${ writeTo }` );
				resolve( { path: writeTo } );
			} );
			res.pipe( gunzip ).pipe( writeStream );
		} )
			.on( 'error', err => {
				debug( 'ERROR:', err );
				reject( err );
			} )
			.end();
	} );
};

module.exports = downloadBinary;
