/* eslint-disable security/detect-non-literal-fs-filename */
const { expect } = require( '@jest/globals' );
const debugFactory = require( 'debug' );
const nock = require( 'nock' );
const { createReadStream, createWriteStream, existsSync, mkdtempSync, promises, unlinkSync } = require( 'node:fs' );
const { tmpdir } = require( 'node:os' );
const path = require( 'node:path' );
const { Stream } = require( 'node:stream' );

const thisPackage = require( '../../' );
const { replace, validate } = thisPackage;
const {
	ARCH_MAPPING,
	downloadBinary,
	getInstallDir,
	getLatestReleaseUrlForPlatformAndArch,
	installBinary,
	PLATFORM_MAPPING,
} = require( '../../lib/install-go-binary' );

const debug = debugFactory( 'vip-search-replace:index.test' );
const processPath = process.cwd();

let readableStream;
let writeableStream;
const tmpDir = mkdtempSync( path.join( tmpdir(), 'vip-search-replace-tests-' ) );
const readFilePath = path.join( processPath, '__tests__', 'lib', 'in-sample.sql' );
const writeFilePath = path.join( tmpDir, 'out-sample.sql' );
const nonZeroExitCodeScript = path.join( processPath, 'bin', 'non-zero-exit-code.sh' );

beforeEach( () => {
	readableStream = createReadStream( readFilePath );
	writeableStream = createWriteStream( writeFilePath, { encoding: 'utf8' } );
} );

afterEach( () => {
	readableStream.close();
	writeableStream.close();
	if ( existsSync( writeFilePath ) ) {
		unlinkSync( writeFilePath );
	}
} );

/**
 * @param {string[]} replacements
 * @param {string|null} [customScript]
 * @returns {Promise<{result: Stream, outFile: string | undefined}>}
 */
async function testHarness( replacements, customScript = null ) {
	debug( replacements, customScript );
	const binary = process.env.CI === 'true' ? './bin/go-search-replace-test' : null;
	const script = customScript || binary;
	const result = await replace( readableStream, replacements, script );

	await /** @type {Promise<void>} */ ( new Promise( ( resolve ) => {
		writeableStream.on( 'finish', () => {
			resolve();
		} );

		result.pipe( writeableStream );
	} ) );

	let outFile;
	debug( 'outfile exists:', existsSync( writeFilePath ) );
	if ( existsSync( writeFilePath ) ) {
		outFile = await promises.readFile( writeFilePath, 'utf-8' );
	}

	return { result, outFile };
}

describe( 'go-search-replace', () => {
	describe( 'validate()', () => {
		const consoleSpy = jest.spyOn( console, 'error' ).mockImplementation();

		beforeEach( () => {
			consoleSpy.mockClear();
		} );

		it( 'fails if a readable stream is not passed as the first argument', () => {
			expect( validate( writeableStream, [ 'thing' ] ) ).toBe( false );
			expect( console.error ).toHaveBeenLastCalledWith( 'The first argument must be an instance of a Readable stream.' );
			expect( console.error ).toHaveBeenCalledTimes( 1 );
		} );

		it( 'fails if an array is not passed as the second argument', () => {
			expect( validate( readableStream, 'replace-string' ) ).toBe( false );
			expect( console.error ).toHaveBeenLastCalledWith( 'The second argument must be an array.' );
			expect( validate( readableStream, 234 ) ).toBe( false );
			expect( console.error ).toHaveBeenLastCalledWith( 'The second argument must be an array.' );
			expect( validate( readableStream, new Set( [ 'thing' ] ) ) ).toBe( false );
			expect( console.error ).toHaveBeenLastCalledWith( 'The second argument must be an array.' );
			expect( console.error ).toHaveBeenCalledTimes( 3 );
		} );

		it( 'passes if a readable stream is passed as the first argument', () => {
			expect( validate( readableStream, [ 'thing' ] ) ).toBe( true );
			expect( console.error ).not.toHaveBeenCalled();
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

		it( 'throws a new Error when the script/binary returns a non-zero exit code', () =>
			expect( testHarness( [ 'thisdomain.com', 'thatdomain.com' ], nonZeroExitCodeScript ) ).rejects.toThrow( 'The search and replace process exited with a non-zero exit code: 1' ),
		);
	} );
} );

describe( 'install-go-binary', () => {
	describe( 'constants', () => {
		it( 'should have correct arch mappings', () => {
			expect( ARCH_MAPPING ).toEqual( {
				ia32: '386',
				x64: 'amd64',
				arm64: 'arm64',
			} );
		} );
	} );

	it( 'should have correct platform mappings', () => {
		expect( PLATFORM_MAPPING ).toEqual( {
			darwin: 'darwin',
			linux: 'linux',
			win32: 'windows',
		} );
	} );

	describe( 'getLatestReleaseUrlForPlatformAndArch()', () => {
		it( 'should get a proper macintel env url', () => {
			const url = getLatestReleaseUrlForPlatformAndArch( { arch: 'x64', platform: 'darwin' } );
			expect( url ).toBe( 'https://github.com/Automattic/go-search-replace/releases/latest/download/go-search-replace_darwin_amd64.gz' );
		} );

		it( 'should get a proper macm1 env url', () => {
			const url = getLatestReleaseUrlForPlatformAndArch( { arch: 'arm64', platform: 'darwin' } );
			expect( url ).toBe( 'https://github.com/Automattic/go-search-replace/releases/latest/download/go-search-replace_darwin_arm64.gz' );
		} );

		it( 'should get a proper linux / CI test env url', () => {
			const url = getLatestReleaseUrlForPlatformAndArch( { arch: 'x64', platform: 'linux' } );
			expect( url ).toBe( 'https://github.com/Automattic/go-search-replace/releases/latest/download/go-search-replace_linux_amd64.gz' );
		} );

		it( 'should get a proper 32 bit linux url', () => {
			const url = getLatestReleaseUrlForPlatformAndArch( { arch: 'ia32', platform: 'linux' } );
			expect( url ).toBe( 'https://github.com/Automattic/go-search-replace/releases/latest/download/go-search-replace_linux_386.gz' );
		} );

		it( 'should get a proper windows url', () => {
			const url = getLatestReleaseUrlForPlatformAndArch( { arch: 'ia32', platform: 'win32' } );
			expect( url ).toBe( 'https://github.com/Automattic/go-search-replace/releases/latest/download/go-search-replace_windows_386.exe.gz' );
		} );

		it( 'should throw for invalid arch', () => {
			expect( () => getLatestReleaseUrlForPlatformAndArch( { arch: 'gibberish', platform: 'win32' } ) ).toThrow( new Error( 'Invalid arch type' ) );
		} );

		it( 'should throw for invalid platform', () => {
			expect( () => getLatestReleaseUrlForPlatformAndArch( { arch: 'ia32', platform: 'gibberish' } ) ).toThrow( new Error( 'Invalid platform type' ) );
		} );
	} );

	describe( 'downloadBinary()', () => {
		beforeEach( () => {
			nock.cleanAll();
			nock.enableNetConnect();
		} );

		it( 'should return a readable stream', async () => {
			nock( 'https://github.com' )
				.get( '/Automattic/go-search-replace/releases/latest/download/go-search-replace_darwin_amd64.gz' )
				.reply( 200 );

			const downloadStream = await downloadBinary( { arch: 'x64', platform: 'darwin' } );
			expect( downloadStream instanceof Stream ).toBe( true );
			expect( typeof downloadStream.read ).toBe( 'function' );
		} );

		it( 'should fail for unsupported platform', async () => {
			nock.disableNetConnect(); // no calls should be made
			await expect( downloadBinary( { arch: 'ia32', platform: 'gibberish' } ) ).rejects.toEqual( new Error( 'Invalid platform type' ) );
		} );

		it( 'should fail for unsupported arch', async () => {
			nock.disableNetConnect(); // no calls should be made
			return expect( downloadBinary( { arch: 'gibberish', platform: 'win32' } ) ).rejects.toEqual( new Error( 'Invalid arch type' ) );
		} );
	} );

	describe( 'getInstallDir()', () => {
		const fsAccessSpy = jest.spyOn( promises, 'access' );
		const fsMkdirSpy = jest.spyOn( promises, 'mkdir' );
		const fsMkdTempSpy = jest.spyOn( promises, 'mkdtemp' );

		it( 'should return the package dir when writable', async () => {
			fsAccessSpy.mockResolvedValue();
			fsMkdirSpy.mockResolvedValue( undefined );
			const binDir = await getInstallDir();
			expect( fsAccessSpy ).toHaveBeenCalled();
			expect( fsMkdirSpy ).toHaveBeenCalled();
			expect( fsMkdTempSpy ).not.toHaveBeenCalled();
			expect( binDir ).toBe( path.join( path.dirname( path.dirname( __dirname ) ), 'bin' ) );
		} );

		it( 'should return a temp dir when cannot call mkdir (recursive) on default dir', async () => {
			fsMkdirSpy.mockRejectedValue( undefined );
			fsMkdTempSpy.mockResolvedValue( '/tmp/vip-search-replace-89ds89f9j8g9adfadsfdas' );
			const binDir = await getInstallDir();
			expect( fsMkdirSpy ).toHaveBeenCalled();
			expect( fsAccessSpy ).not.toHaveBeenCalled();
			expect( fsMkdTempSpy ).toHaveBeenCalled();
			expect( binDir ).toBe( '/tmp/vip-search-replace-89ds89f9j8g9adfadsfdas' );
		} );

		it( 'should return a temp dir when cannot write to default dir', async () => {
			fsMkdirSpy.mockResolvedValue( undefined );
			fsAccessSpy.mockRejectedValue( undefined );
			fsMkdTempSpy.mockResolvedValue( '/tmp/vip-search-replace-213432fsdjafds99fdsa' );
			const binDir = await getInstallDir();
			expect( fsMkdirSpy ).toHaveBeenCalled();
			expect( fsAccessSpy ).toHaveBeenCalled();
			expect( fsMkdTempSpy ).toHaveBeenCalled();
			expect( binDir ).toBe( '/tmp/vip-search-replace-213432fsdjafds99fdsa' );
		} );
	} );

	describe( 'installBinary()', () => {
		const fsOpenSpy = jest.spyOn( promises, 'open' );

		it( 'should error for unwritable file', async () => {
			fsOpenSpy.mockRejectedValue( 'BADOPEN' );
			await expect( installBinary() ).rejects.toThrow( 'Could not open the destination file for writing: BADOPEN' );
			expect( fsOpenSpy ).toHaveBeenCalled();
		} );
	} );
} );
