# error-system

[![Version](http://img.shields.io/npm/v/error-system.svg?style=flat-square)](https://www.npmjs.org/package/error-system)
[![build status](https://img.shields.io/travis/fanatid/error-system.svg?branch=master&style=flat-square)](http://travis-ci.org/fanatid/error-system)
[![Coverage Status](https://img.shields.io/coveralls/fanatid/error-system.svg?style=flat-square)](https://coveralls.io/r/fanatid/error-system)

Your custom errors in your JavaScript code!

Inspired by [node-errno](http://github.com/rvagg/node-errno).

Based on errors in [bitcore](https://github.com/bitpay/bitcore).

## Example

### createError
```js
var errorSystem = require('error-system')
var RequestError = errorSystem.createError('RequestError', 'Code: {0} (url: {1})')
var request = require('request')

var url = 'https://github.com/notfound11'
request(url, function (error, response) {
  if (error === null && response.statusCode !== 200) {
    error = new RequestError(response.statusCode, url)
  }

  if (error !== null) {
    // ErrorRequestError: Code: 404 (url: https://github.com/notfound11)
    console.error(error.stack.split('\n')[0])
  }
})
```

### extend
```js
var errorSystem = require('error-system')
var RequestError = errorSystem.extend(Error, {
  name: 'RequestError',
  message: 'Code: {0} (url: {1})',
  errors: [
    {
      name: 'NotFound',
      message: 'Code: 404 (url: {0})'
    }
  ]
})
var request = require('request')

var url = 'https://github.com/notfound11'
request(url, function (error, response) {
  if (error === null && response.statusCode !== 200) {
    if (response.statusCode === 404) {
      error = new RequestError.NotFound(url)
    } else if (response.statusCode !== 200) {
      error = new RequestError(response.statusCode, url)
    }
  }

  if (error !== null) {
    // ErrorRequestErrorNotFound: Code: 404 (url: https://github.com/notfound11)
    console.error(error.stack.split('\n')[0])
  }
})
```

## License

Code released under [the MIT license](https://github.com/fanatid/error-system/blob/master/LICENSE).
