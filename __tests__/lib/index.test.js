const thisPackage = require( '../../' );
const { replace, validate } = thisPackage;
const fs = require( 'fs' );
const { expect } = require( '@jest/globals' );

jest.mock( 'child_process', () => {
	return {
		spawn() {
			return {
				on: () => true,
				stdin: {
					on: () => true,
					write: () => true,
					end: () => true,
					once: () => true,
					emit: () => true,
				},
				stdout: {
					on: () => true,
					updated: {},
				},
			};
		},
	};
} );

let readableStream, writeableStream;
const readFilePath = __dirname + '/index.test.js';
const writeFilePath = __dirname + '/writeStream.txt';

beforeEach( () => {
	readableStream = fs.createReadStream( readFilePath );
	writeableStream = fs.createWriteStream( writeFilePath );
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
			const result = await replace( readableStream, [ 'thing' ] );
			expect( result ).toBeInstanceOf( Object );
			expect( result ).toHaveProperty( 'updated' );
		} );
	} );
} );
