/*
 * MIT License
 *
 * Copyright (c) 2018 Automattic
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
/**
 * External dependencies
 */
const { spawn } = require( 'child_process' );
const stream = require( 'stream' );
const debug = require( 'debug' )( 'vip-search-replace:index' );

/**
 * Internal dependencies
 */
const downloadBinary = require( './install-go-binary' );

/**
 * Validate the library inputs
 *
 * @param {Readable} streamObj The readable stream
 * @param {Array} replacements An array of replacements
 * @return {Boolean} valid
 */
function validate( streamObj, replacements ) {
	let valid = true;
	if ( ! ( streamObj instanceof stream.Readable ) ) {
		console.error( 'The first argument must be an instance of a Readable stream.' );
		valid = false;
	}
	if ( ! Array.isArray( replacements ) ) {
		console.error( 'The second argument must be a array.' );
		valid = false;
	}
	return valid;
}

/**
 * The Search and Replace Process
 *
 * @param {Readable} streamObj The readable stream
 * @param {Array} replacements An array of replacements
 * @param {Binary} binary An optional binary can be passed in for testing
 * @return {Readable} streamObj
 */
async function replace( streamObj, replacements, binary = null ) {
	const valid = validate( streamObj, replacements );
	if ( ! valid ) {
		process.exit( 1 );
	}
	debug( 'The supplied arguments are valid' );

	// only download the binary if we didn't supply one
	if ( binary === null ) {
		try {
			const downloaded = await downloadBinary();
			debug( downloaded );
		} catch ( err ) {
			console.error( err );
		}
	} else {
		debug( 'NOT DOWNLOADING A BINARY' );
	}

	debug( 'Go binaries are installed' );

	const useBinary = binary || 'go-search-replace';

	const replaceProcess = spawn( useBinary, replacements, {
		stdio: [ 'pipe', 'pipe', process.stderr ],
	} );
	replaceProcess.on( 'error', err => {
		debug( 'Replace Process Error:', err );
		console.error( '\n' + err.toString() );
		process.exit( 1 );
	} );

	streamObj.on( 'error', error => {
		console.error( error );
	} );
	streamObj.pipe( replaceProcess.stdin );
	streamObj = replaceProcess.stdout;
	return streamObj;
}

module.exports = {
	replace,
	validate,
};
