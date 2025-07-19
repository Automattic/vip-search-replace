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
const fs = require( 'node:fs' );
const { tmpdir } = require( 'node:os' );
const path = require( 'node:path' );
const { Readable } = require( 'node:stream' );
const { pipeline } = require( 'node:stream/promises' );
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
 * Ensures that the error is an instance of Error.
 *
 * @param {unknown} err
 * @return {Error}
 */
function ensureError( err ) {
	if ( err instanceof Error ) {
		return err;
	}

	return new Error( String( err ) ); // NOSONAR
}

/**
 * @param {{ arch?: string, platform?: string }} options
 * @returns {Promise<import('node:stream').Readable>}
 */
async function downloadBinary( { arch = process.arch, platform = process.platform } = {} ) {
	const url = getLatestReleaseUrlForPlatformAndArch( { platform, arch } );
	debug( 'Requested URL: ', url );

	try {
		const response = await fetch( url, {
			redirect: 'follow',
		} );

		debug( JSON.stringify( { statusCode: response.status, responseUrl: response.url } ) );
		if ( ! response.ok ) {
			throw new Error( `Failed to download binary: ${ response.status } ${ response.statusText }` );
		}

		if ( ! response.body ) {
			throw new Error( 'Response body is empty' );
		}

		return Readable.fromWeb( response.body );
	} catch ( err ) {
		debug( 'ERROR:', err );
		throw ensureError( err );
	}
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
	} catch ( err ) {
		debug( 'Error in getInstallDir:', err );
	}

	// Either cannot create or write to the package dir, fall back to a temporary dir
	debug( 'Falling back to a temporary dir' );

	const tmpDir = await fs.promises.mkdtemp( path.join( tmpdir(), 'vip-search-replace-' ) );
	process.once( 'exit', () => {
		debug( `Removing temporary dir: ${ tmpDir }` );
		fs.promises.rm( tmpDir, { recursive: true, force: true } ).catch( ( err ) => {
			debug( 'Error removing temporary dir:', err );
		} );
	} );

	return tmpDir;
}

async function closeFd( fd ) {
	try {
		await fd.close();
	} catch ( err ) {
		debug( 'Error closing file descriptor:', err );
	}
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
		const message = err instanceof Error ? err.message : String( err );
		throw new Error( `Could not open the destination file for writing: ${ message }` );
	}

	debug( 'OK to write.' );

	let responseStream;
	try {
		responseStream = await downloadBinary( { platform, arch } );
	} catch ( downloadErr ) {
		debug( { downloadErr } );
		await closeFd( fd );
		throw ensureError( downloadErr );
	}

	debug( 'Download stream is OK.' );

	// eslint-disable-next-line security/detect-non-literal-fs-filename
	const writeStream = fs.createWriteStream( writeTo, { fd } );
	const gunzip = createGunzip();
	try {
		await pipeline( responseStream, gunzip, writeStream );

		debug( `Installed binary to path: ${ writeTo }` );

		return {
			arch,
			path: writeTo,
			platform,
		};
	} catch ( err ) {
		debug( 'Error downloading the file:', err );

		try {
			// eslint-disable-next-line security/detect-non-literal-fs-filename
			await fs.promises.unlink( writeTo );
		} catch ( unlinkErr ) {
			debug( 'Error removing failed download:', unlinkErr );
		}

		const error = ensureError( err );
		throw new Error( `Failed to install binary: ${ error.message }`, { cause: error } );
	}
}

module.exports = {
	ARCH_MAPPING,
	downloadBinary,
	getInstallDir,
	getLatestReleaseUrlForPlatformAndArch,
	installBinary,
	PLATFORM_MAPPING,
};
