const thisPackage = require( '../../' );
const { replace, validate } = thisPackage;
const fs = require( 'fs' );
const path = require( 'path' );
const { expect } = require( '@jest/globals' );

const processPath = process.cwd();

let readableStream, writeableStream;
const readFilePath = path.join( processPath, '__tests__', 'lib', 'in-sample.sql' );
const writeFilePath = path.join( processPath, '__tests__', 'lib', 'out-sample.sql' );
const nonZeroExitCodeScript = path.join( processPath, 'bin', 'non-zero-exit-code.sh' );

beforeEach( () => {
	readableStream = fs.createReadStream( readFilePath );
	writeableStream = fs.createWriteStream( writeFilePath, { encoding: 'utf8' } );
} );

afterEach( () => {
	readableStream.close();
	writeableStream.close();
	if ( fs.existsSync( writeFilePath ) ) {
		fs.unlinkSync( writeFilePath );
	}
	fs.truncateSync( path.join( processPath, 'bin', 'go-search-replace' ) );
} );

async function testHarness( replacements, customScript = null ) {
	const binary = process.env.CI === 'true' ? './bin/go-search-replace-test' : null;
	const script = customScript || binary;
	const result = await replace( readableStream, replacements, script );
	await new Promise( resolve => {
		writeableStream.on( 'finish', () => {
			resolve();
		} );

		result.pipe( writeableStream );
	} );

	let outFile;
	if ( fs.existsSync( writeFilePath ) ) {
		outFile = fs.readFileSync( writeFilePath ).toString();
	}

	return { result, outFile };
}

describe( 'go-search-replace', () => {
	describe( 'validate()', () => {
		it( 'fails if a readable stream is not passed as the first argument', () => {
			expect( validate( writeableStream, [ 'thing' ] ) ).toBe( false );
		} );

		it( 'fails if an array is not passed as the second argument', () => {
			expect( validate( readableStream, 'replace-string' ) ).toBe( false );
			expect( validate( readableStream, 234 ) ).toBe( false );
			expect( validate( readableStream, new Set( [ 'thing' ] ) ) ).toBe( false );
		} );

		it( 'passes if a readable stream is passed as the first argument', () => {
			expect( validate( readableStream, [ 'thing' ] ) ).toBe( true );
		} );
	} );
	describe( 'replace()', () => {
		it( 'returns an instance of the stdout object', async () => {
			const { outFile } = await testHarness( [ 'thisdomain.com', 'thatdomain.com' ] );
			expect( outFile ).toContain( 'thatdomain.com' );
			expect( outFile ).not.toContain( 'thisdomain.com' );
		} );

		it( 'returns the original stream if no replacements are in the array', async () => {
			const { result, outFile } = await testHarness( [] );
			expect( result ).toEqual( readableStream );
			expect( outFile ).toContain( 'thisdomain.com' );
			expect( outFile ).not.toContain( 'thatdomain.com' );
		} );

		it( 'throws a new Error when the script/binary returns a non-zero exit code', () => {
			async function whatever() {
				try {
					await replace( readableStream, [ 'thisdomain.com', 'thatdomain.com' ], nonZeroExitCodeScript );
				} catch ( error ) {
					throw new Error( error );
				}
			}
			expect( whatever()
				.catch( error => {
					throw new Error( error );
				} ) )
				.rejects
				.toThrowError( 'The search and replace process exited with a non-zero exit code: 1' );
		} );
	} );
} );
