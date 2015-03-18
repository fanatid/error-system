var util = require('./util')

/**
 * @param {*} value
 * @return {string}
 */
function getName (value) {
  return Object.prototype.toString.call(value).slice(8, -1)
}

var msgfmt = 'Expected property `{0}` of type {1}, got {2} for spec: {3}'
var getMsg = util.createFormatter(msgfmt)

/**
 * @param {ErrorSpec} value
 * @throws {TypeError}
 */
function enforceErrorSpec (spec) {
  if (getName(spec) !== 'Object') {
    throw new TypeError('ErrorSpec must be an Object')
  }

  if (getName(spec.name) !== 'String') {
    throw new TypeError(getMsg('name', 'String', getName(spec.name), JSON.stringify(spec)))
  }

  if (spec.name === '') {
    throw new TypeError('Expect "name" not empty string (' + JSON.stringify(spec) + ')')
  }

  if (['String', 'Function'].indexOf(getName(spec.message)) === -1) {
    throw new TypeError(getMsg('message', 'String or Function', getName(spec.message), JSON.stringify(spec)))
  }

  if (spec.errors !== undefined) {
    if (getName(spec.errors) !== 'Array') {
      throw new TypeError(getMsg('errors', 'Array', getName(spec.errors), JSON.stringify(spec)))
    }

    spec.errors.forEach(enforceErrorSpec)
  }
}

module.exports = {
  getName: getName,
  enforceErrorSpec: enforceErrorSpec
}
