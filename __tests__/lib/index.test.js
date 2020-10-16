const thisPackage = require( '../../' );
const { replace, validate } = thisPackage;
const fs = require( 'fs' );
const { expect } = require( '@jest/globals' );

let readableStream, writeableStream;
const readFilePath = __dirname + '/in-sample.sql';
const writeFilePath = __dirname + '/out-sample.sql';

beforeEach( () => {
	readableStream = fs.createReadStream( readFilePath );
	writeableStream = fs.createWriteStream( writeFilePath, { encoding: 'utf8' } );
} );

afterEach( () => {
	readableStream.close();
	writeableStream.close();
	fs.unlinkSync( writeFilePath );
	fs.truncateSync( process.cwd() + '/bin/go-search-replace' );
} );

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
			const result = await replace( readableStream, [ 'thisdomain.com', 'thatdomain.com' ] );
			await new Promise( resolve => {
				writeableStream.on( 'finish', () => {
					resolve();
				} );

				result.pipe( writeableStream );
			} );

			const outFile = fs.readFileSync( writeFilePath ).toString();
			expect( outFile ).toContain( 'thatdomain.com' );
		} );
	} );
} );
