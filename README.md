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

## Contributing

### Commit Messages

This library uses nlm for package lifecycle management.  As a result all commit messages
must follow the Angular Commit message format: https://github.com/angular/angular/blob/master/CONTRIBUTING.md#type

### Tests

To execute tests before committing your changes, run:

```bash
npm t
```
