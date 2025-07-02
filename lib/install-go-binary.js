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
const debug = require( 'debug' )( 'vip-search-replace:install-go-binary' );
const { https } = require( 'follow-redirects' );
const fs = require( 'node:fs' );
const { tmpdir } = require( 'node:os' );
const path = require( 'node:path' );
const { createGunzip } = require( 'node:zlib' );

// Mapping from Node's `process.arch` to Golang's `$GOARCH`
const ARCH_MAPPING = {
	ia32: '386',
	x64: 'amd64',
	arm64: 'arm64',
};

// Mapping between Node's `process.platform` to Golang's
const PLATFORM_MAPPING = {
	darwin: 'darwin',
	linux: 'linux',
	win32: 'windows',
};

/**
 * @param {string} platform
 */
function getBinSuffix( platform ) {
	return [ 'win32', 'windows' ].includes( platform ) ? '.exe' : '';
}

function getLatestReleaseUrlForPlatformAndArch( { platform = '', arch = '' } = {} ) {
	// eslint-disable-next-line security/detect-object-injection
	const _platform = PLATFORM_MAPPING[ platform ];
	if ( ! _platform ) {
		throw new Error( 'Invalid platform type' );
	}

	// eslint-disable-next-line security/detect-object-injection
	const _arch = ARCH_MAPPING[ arch ];
	if ( ! _arch ) {
		throw new Error( 'Invalid arch type' );
	}
	return `https://github.com/Automattic/go-search-replace/releases/latest/download/go-search-replace_${ _platform }_${ _arch }${ getBinSuffix( _platform ) }.gz`;
}

/**
 * @param {{ arch?: string, platform?: string }} options
 */
async function downloadBinary( { arch = process.arch, platform = process.platform } = {} ) {
	const url = getLatestReleaseUrlForPlatformAndArch( { platform, arch } );

	return new Promise( ( resolve, reject ) => {
		debug( 'Requested URL: ', url );
		https
			.request( url, ( res ) => {
				debug( JSON.stringify( { statusCode: res.statusCode, responseUrl: res.responseUrl } ) );
				resolve( res );
			} )
			.on( 'error', ( err ) => {
				debug( 'ERROR:', err );
				reject( err );
			} )
			.end();
	} );
}

async function getInstallDir() {
	const binDir = path.join( path.dirname( __dirname ), 'bin' );
	debug( `Trying dir: ${ binDir }` );
	try {
		// Ensure the dir exists
		await fs.promises.mkdir( binDir, { recursive: true } );

		debug( 'Path to dir is ok' );

		// Ensure the dir is writeable
		await fs.promises.access( binDir, fs.constants.W_OK );

		debug( 'Dir is writable' );

		return binDir;
	} catch {}

	// Either cannot create or write to the package dir, fall back to a temporary dir
	debug( 'Falling back to a temporary dir' );

	return fs.promises.mkdtemp( path.join( tmpdir(), 'vip-search-replace-' ) );
}

async function installBinary( { arch = process.arch, platform = process.platform, writePath = null } = {} ) {
	let writeTo;

	if ( writePath ) {
		writeTo = writePath;
	} else {
		const binDir = await getInstallDir();
		writeTo = `${ path.join( binDir, 'go-search-replace' ) }${ getBinSuffix( platform ) }`;
	}

	debug( `Attempting to open for writing: ${ writeTo }` );

	let fd;
	try {
		// eslint-disable-next-line security/detect-non-literal-fs-filename
		fd = await fs.promises.open( writeTo, 'w', 0o755 );
	} catch ( err ) {
		const error = err instanceof Error ? err : new Error( err );
		return Promise.reject( new Error( `Could not open the destination file for writing: ${ error.message }` ) );
	}

	debug( 'OK to write.' );

	let responseStream;
	try {
		responseStream = await downloadBinary( { platform, arch } );
	} catch ( downloadErr ) {
		debug( { downloadErr } );
		const error = downloadErr instanceof Error ? downloadErr : new Error( downloadErr );
		return Promise.reject( error );
	}

	debug( 'Download stream is OK.' );

	return new Promise( ( resolve, reject ) => {
		// eslint-disable-next-line security/detect-non-literal-fs-filename
		const writeStream = fs.createWriteStream( writeTo, { fd } );
		writeStream.on( 'error', ( writeErr ) => {
			debug( { writeErr } );
			fd.close();
			reject( new Error( `Could not complete file write: ${ writeErr.message }` ) );
		} );
		writeStream.on( 'finish', () => {
			debug( `Installed binary to path: ${ writeTo }` );
			fd.close();
			resolve( {
				arch,
				path: writeTo,
				platform,
			} );
		} );

		const gunzip = createGunzip();
		gunzip.on( 'error', ( gunzipErr ) => {
			debug( { gunzipErr } );
			reject( new Error( `Could not complete file decompression: ${ gunzipErr.message }` ) );
		} );

		responseStream.pipe( gunzip ).pipe( writeStream );
	} );
}

module.exports = {
	ARCH_MAPPING,
	downloadBinary,
	getInstallDir,
	getLatestReleaseUrlForPlatformAndArch,
	installBinary,
	PLATFORM_MAPPING,
};
