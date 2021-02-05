const thisPackage = require( '../../' );
const { replace, validate } = thisPackage;
const fs = require( 'fs' );
const os = require( 'os' );
const path = require( 'path' );
const { expect } = require( '@jest/globals' );
const debug = require( 'debug' )( 'vip-search-replace:index.test' );

const processPath = process.cwd();

let readableStream, writeableStream;
const tmpDir = fs.mkdtempSync( path.join( os.tmpdir(), 'vip-search-replace-tests-' ) );
const readFilePath = path.join( processPath, '__tests__', 'lib', 'in-sample.sql' );
const writeFilePath = path.join( tmpDir, 'out-sample.sql' );
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
} );

async function testHarness( replacements, customScript = null ) {
	debug( replacements, customScript );
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
	debug( 'outfile exists:', fs.existsSync( writeFilePath ) );
	if ( fs.existsSync( writeFilePath ) ) {
		outFile = fs.readFileSync( writeFilePath, 'utf-8' );
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

		it( 'throws a new Error when the script/binary returns a non-zero exit code', async () => {
			async function check() {
				try {
					//await replace( readableStream, [ 'thisdomain.com', 'thatdomain.com' ], nonZeroExitCodeScript );
					return await testHarness( [ 'thisdomain.com', 'thatdomain.com' ], nonZeroExitCodeScript );
				} catch ( e ) {
					throw new Error( e );
				}
			}

			expect( check() ).rejects.toThrowError( new Error( 'The search and replace process exited with a non-zero exit code: 1' ) );
		} );
	} );
} );
