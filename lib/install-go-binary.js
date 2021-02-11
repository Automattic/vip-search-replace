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
const os = require( 'os' );
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

function getBinSuffix( platform ) {
	return [ 'win32', 'windows' ].includes( platform ) ? '.exe' : '';
}

function getLatestReleaseUrlForPlatformAndArch( { platform, arch } = {} ) {
	const _platform = PLATFORM_MAPPING[ platform ];
	if ( ! _platform ) {
		throw new Error( 'Invalid platform type' );
	}
	const _arch = ARCH_MAPPING[ arch ];
	if ( ! _arch ) {
		throw new Error( 'Invalid arch type' );
	}
	return `https://github.com/Automattic/go-search-replace/releases/latest/download/go-search-replace_${ _platform }_${ _arch }${ getBinSuffix( _platform ) }.gz`;
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
	} catch ( err ) {}

	// Either cannot create or write to the package dir, fall back to a temporary dir
	debug( 'Falling back to a temporary dir' );

	return fs.promises.mkdtemp( path.join( os.tmpdir(), 'vip-search-replace-' ) );
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
		fd = await fs.promises.open( writeTo, 'w', 0o755 );
	} catch ( err ) {
		return Promise.reject( `Could not open the destination file for writing: ${ err }` );
	}

	debug( 'OK to write.' );

	return new Promise( async ( resolve, reject ) => {
		let responseStream;
		try {
			responseStream = await downloadBinary( { platform, arch } );
		} catch ( downloadErr ) {
			debug( { downloadErr } );
			return reject( downloadErr );
		}

		debug( 'Download stream is OK.' );

		const writeStream = fs.createWriteStream( writeTo, { fd } );
		writeStream.on( 'error', writeErr => {
			debug( { writeErr } );
			reject( `Could not complete file write: ${ writeErr }` );
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
			reject( `Could not complete file decompression: ${ gunzipErr }` );
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
