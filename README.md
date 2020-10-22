# VIP Search & Replace

## How to use this package?

```js
const { replace } = require( '@automattic/vip-search-replace' );

// Create a readable and writeable stream. Can be any stream: File, std, etc...
const readableStream = fs.createReadStream( 'path_to_sql_file.sql' );
const writeableStream = fs.createWriteStream( 'path_to_sql_file_replaced.sql', { encoding: 'utf8' } );

const result = await replace( readableStream, [ 'thisdomain.com', 'thatdomain.com' ] );

result.pipe( writeableStream );
```
