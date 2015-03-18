var inherits = require('inherits')

var typeforce = require('./typeforce')
var util = require('./util')

/**
 * @typedef {Object} ErrorSpec
 * @property {string} name
 * @property {(function|string)} message
 * @property {ErrorSpec[]} [errors]
 */

/**
 * @param {function} parent
 * @param {(ErrorSpec|ErrorSpec[])} specs
 */
function extend (parent, specs) {
  if (typeforce.getName(parent) !== 'Function') {
    throw new TypeError('`parent` for extending must be a function')
  }

  if (typeforce.getName(specs) !== 'Array') {
    specs = [specs]
  }

  // check all specs before extend, have overhead but all safe
  specs.forEach(function (spec) { typeforce.enforceErrorSpec(spec) })

  specs.forEach(function (spec) {
    var getMessage = typeforce.getName(spec.message) === 'String'
      ? util.createFormatter(spec.message)
      : spec.message

    var CustomError = function () {
      parent.call(this)

      if (Error.captureStackTrace) {
        /* eslint-disable no-caller */
        Error.captureStackTrace(this, arguments.callee)
        /* eslint-enable no-caller */

      } else {
        this.stack = (new Error()).stack

      }

      this.message = getMessage.apply(null, Array.prototype.slice.call(arguments))
    }
    inherits(CustomError, parent)
    CustomError.prototype.name = parent.prototype.name + spec.name

    parent[spec.name] = CustomError

    if (spec.errors) {
      spec.errors.forEach(function (lspec) { extend(CustomError, lspec) })
    }
  })

  return parent
}

/**
 * @param {string} name
 * @param {string} message
 * @param {function} [parent=Error]
 */
function createError (name, message, parent) {
  if (parent === undefined) {
    parent = Error
  }

  extend(parent, {name: name, message: message})
  return parent[name]
}

module.exports = {
  extend: extend,
  createError: createError,

  typeforce: typeforce,
  util: util
}
