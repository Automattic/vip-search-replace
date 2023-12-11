#!/usr/bin/env node
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
const { ARCH_MAPPING, installBinary, PLATFORM_MAPPING } = require( '../lib/install-go-binary' );

const [ platform, arch, writePath ] = process.argv.slice( 2 );

function printUsage() {
	console.log( `
Usage: ${ process.argv.slice( 0, 1 ).join( ' ' ) } <platform> <arch> <writePath>

  All options are optional and will default to values from your process env.

  * Valid values for platform: ${ Object.keys( PLATFORM_MAPPING ).join( ', ' ) }
  * Valid values for arch: ${ Object.keys( ARCH_MAPPING ).join( ', ' ) }
  * writePath defaults to: <package-install-dir>/bin/go-search-replace
` );
}

if ( [ '-h', 'help', '--help', 'usage' ].includes( platform ) ) {
	printUsage();
	process.exit( 0 );
}

installBinary( { arch, platform, writePath } )
	.then( ( result ) => console.log( `✅ Installed ${ result.platform }:${ result.arch } binary to: ${ result.path }` ) )
	.catch( ( err ) => {
		console.error( 'Installed Failed: Check command line arguments and file system settings.' );
		console.error( err );
		printUsage();
		process.exit( 1 );
	} );
