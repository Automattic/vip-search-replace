[![nlm-github](https://img.shields.io/badge/github-Automattic%2Fvip--search--replace%2Fissues-F4D03F?logo=github&logoColor=white)](https://github.com/Automattic/vip-search-replace/issues)
![nlm-version](https://img.shields.io/badge/version-1.1.1-blue?logo=version&logoColor=white)
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

For details about contributing to this project (e.g. setting up development environment, publishing a release, etc.), please see [CONTRIBUTING.md](CONTRIBUTING.md).
