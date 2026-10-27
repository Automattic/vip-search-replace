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
const debug = require( 'debug' )( 'vip-search-replace:index' );
const { spawn } = require( 'node:child_process' );
const { PassThrough, Readable } = require( 'node:stream' );

const { installBinary } = require( './install-go-binary' );

/**
 * Validate the library inputs
 *
 * @param {*} streamObj The readable stream
 * @param {*} replacements An array of replacements
 * @return {boolean} valid
 */
function validate( streamObj, replacements ) {
	let valid = true;
	if ( ! ( streamObj instanceof Readable ) ) {
		console.error( 'The first argument must be an instance of a Readable stream.' );
		valid = false;
	}
	if ( ! Array.isArray( replacements ) ) {
		console.error( 'The second argument must be an array.' );
		valid = false;
	}
	return valid;
}

/**
 * The Search and Replace Process
 *
 * @param {Readable} streamObj The readable stream
 * @param {string[]} replacements An array of replacements
 * @param {string|null|undefined} binary An optional binary can be passed in for testing
 * @return {Promise<Readable>} streamObj
 */
async function replace( streamObj, replacements, binary = null ) {
	const valid = validate( streamObj, replacements );
	if ( ! valid ) {
		throw new Error( 'The supplied arguments are invalid.' );
	}
	debug( 'The supplied arguments are valid' );

	if ( ! replacements.length ) {
		debug( 'No replacements were provided to search and replace with.' );
		return streamObj;
	}

	let useBinary = binary || 'go-search-replace';

	// only download the binary if we didn't supply one
	if ( binary === null ) {
		try {
			const installed = await installBinary();
			useBinary = installed.path;
			debug( `Using binary at path: ${ useBinary }` );
		} catch ( err ) {
			const message = err instanceof Error ? err.message : String( err );
			debug( `Error installing binary:`, err );
			throw new Error( `Error installing binary: ${ message }` );
		}
	} else {
		debug( 'NOT DOWNLOADING A BINARY', binary );
	}

	debug( 'Go binaries are installed' );
	debug( 'useBinary: ', useBinary );

	const replaceProcess = spawn( useBinary, replacements, {
		stdio: [ 'pipe', 'pipe', process.stderr ],
	} );

	// Keep the output open until the child has exited successfully.
	const outStream = new PassThrough();
	replaceProcess.stdout.pipe( outStream, { end: false } );

	await new Promise( ( resolve, reject ) => {
		let returned = false;
		let failed = false;
		const fail = ( error ) => {
			if ( failed ) {
				return;
			}
			failed = true;
			streamObj.unpipe( replaceProcess.stdin );
			replaceProcess.stdin.destroy();
			if ( returned ) {
				outStream.destroy( error );
			} else {
				outStream.destroy();
				reject( error );
			}
		};
		streamObj
			.on( 'error', ( error ) => {
				fail( new Error( `Error processing input file: ${ error.message }` ) );
				replaceProcess.kill();
			} );
		replaceProcess.stdout.on( 'error', ( error ) => {
			fail( new Error( `Error reading process stdout: ${ error.message }` ) );
			replaceProcess.kill();
		} );

		replaceProcess
			.on( 'error', ( err ) => {
				fail( new Error( `Replace process error: ${ err.message }` ) );
			} )
			.on( 'close', ( code, signal ) => {
				if ( code !== 0 ) {
					fail( new Error( signal
						? `The search and replace process terminated by signal: ${ signal }`
						: `The search and replace process exited with a non-zero exit code: ${ code }` ) );
					return;
				}
				if ( failed ) {
					return;
				}
				outStream.end();
				if ( ! returned ) {
					returned = true;
					resolve();
				}
				debug( 'Replace process returned cleanly' );
			} );

		replaceProcess.stdout.once( 'data', () => {
			returned = true;
			resolve();
		} );

		// EPIPE is expected when the process exits before consuming all stdin (e.g. non-zero exit).
		// Swallow it here so the 'exit' handler can reject with the real error instead.
		replaceProcess.stdin.on( 'error', ( err ) => {
			if ( err.code !== 'EPIPE' ) {
				fail( new Error( `Error writing to process stdin: ${ err.message }` ) );
				replaceProcess.kill();
			}
		} );

		// let it flow;
		streamObj.pipe( replaceProcess.stdin );
	} );

	return outStream;
}

module.exports = {
	replace,
	validate,
};
