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
module.exports.extend = function (parent, specs) {
  if (util.getName(parent) !== 'Function') {
    throw new TypeError('`parent` for extending should be a function')
  }

  if (util.getName(specs) !== 'Array') {
    specs = [specs]
  }

  // check all specs before extend, have overhead but all safe
  specs.forEach(function (spec) {
    typeforce.enforceErrorSpec(spec)
  })

  specs.forEach(function (spec) {
    var getMessage = util.getName(spec.message) === 'String'
      ? util.stringTemplate(spec.message)
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

      this.message = getMessage.apply(null, arguments)
    }

    inherits(CustomError, parent)
    CustomError.prototype.name = parent.prototype.name + spec.name

    parent[spec.name] = CustomError

    if (spec.errors) {
      spec.errors.forEach(function (errorSpec) {
        module.exports.extend(CustomError, errorSpec)
      })
    }
  })

  return parent
}

/**
 * @param {string} name
 * @param {string} message
 * @param {function} [parent=Error]
 */
module.exports.createError = function (name, message, parent) {
  if (parent === undefined) {
    parent = Error
  }

  module.exports.extend(parent, {name: name, message: message})
  return parent[name]
}
