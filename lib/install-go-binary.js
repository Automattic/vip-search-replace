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
const { createGunzip } = require( 'zlib' );
const fs = require( 'fs' );
const path = require( 'path' );
const debug = require( 'debug' )( 'vip-search-replace:install-go-binary' );

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

function getLatestReleaseUrlForPlatformAndArch( { platform, arch } = {} ) {
	const _platform = PLATFORM_MAPPING[ platform ];
	if ( ! _platform ) {
		throw new Error( 'Invalid platform type' );
	}
	const _arch = ARCH_MAPPING[ arch ];
	if ( ! _arch ) {
		throw new Error( 'Invalid arch type' );
	}
	const suffix = platform === 'win32' ? '.exe' : '';
	return `https://github.com/Automattic/go-search-replace/releases/latest/download/go-search-replace_${ _platform }_${ _arch }${ suffix }.gz`;
}

async function downloadBinary( { arch = process.arch, platform = process.platform } = {} ) {
	const url = getLatestReleaseUrlForPlatformAndArch( { platform, arch } );

	return new Promise( ( resolve, reject ) => {
		debug( 'Requested URL: ', url );
		https
			.request( url, res => {
				debug( JSON.stringify( { statusCode: res.statusCode, responseUrl: res.responseUrl } ) );
				resolve( res );
			} )
			.on( 'error', err => {
				debug( 'ERROR:', err );
				reject( err );
			} )
			.end();
	} );
}

async function installBinary( { arch = process.arch, platform = process.platform, writePath = null } = {} ) {
	let writeTo;

	if ( writePath ) {
		writeTo = writePath;
	} else {
		const binDir = path.join( path.dirname( __dirname ), 'bin' );
		debug( { binDir } );
		try {
			// Ensure build path exists
			await fs.promises.mkdir( binDir, { recursive: true } );
		} catch ( mkdirError ) {
			debug( { mkdirError } );
			throw mkdirError;
		}
		const binPath = path.join( binDir, 'go-search-replace' );
		debug( { binPath } );
		writeTo = binPath;
	}

	return new Promise( async ( resolve, reject ) => {
		let responseStream;
		try {
			responseStream = await downloadBinary( { platform, arch } );
		} catch ( downloadErr ) {
			debug( { downloadErr } );
			return reject( downloadErr );
		}

		const writeStream = fs.createWriteStream( writeTo, { mode: 0o755 } );
		writeStream.on( 'error', writeErr => {
			debug( { writeErr } );
			reject( writeErr );
		} );
		writeStream.on( 'finish', () => {
			debug( `Installed binary to path: ${ writeTo }` );
			resolve( {
				arch,
				path: writeTo,
				platform,
			} );
		} );

		const gunzip = createGunzip();
		gunzip.on( 'error', gunzipErr => {
			debug( { gunzipErr } );
			reject( gunzipErr );
		} );

		responseStream.pipe( gunzip ).pipe( writeStream );
	} );
}

module.exports = {
	ARCH_MAPPING,
	downloadBinary,
	installBinary,
	getLatestReleaseUrlForPlatformAndArch,
	PLATFORM_MAPPING,
};
