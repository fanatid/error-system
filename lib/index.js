var objToString = Object.prototype.toString

/**
 * @param {string} message
 * @return {function}
 */
function createFormatter (message) {
  return function () {
    var args = arguments
    return message.replace(/{(\d+)}/g, function (match, index) {
      return typeof args[index] !== 'undefined'
        ? args[index]
        : match
    })
  }
}

/**
 * @typedef {Object} ErrorSpec
 * @property {string} name
 * @property {(function|string)} message
 * @property {ErrorSpec[]} [errors]
 */

/**
 * @param {function} parent
 * @param {ErrorSpec} spec
 */
module.exports.extend = function extend (parent, spec) {
  if (objToString.call(parent) !== '[object Function]') {
    throw new Error('Parent for extending must be a function.')
  }

  if (objToString.call(spec) !== '[object Object]') {
    throw new Error('Spec for extending parent must be an Object.')
  }

  if (objToString.call(spec.name) !== '[object String]' || spec.name === '') {
    throw new Error('Invalid spec.name: ' + spec.name + '.')
  }

  var getMessage
  if (objToString.call(spec.message) === '[object Function]') {
    getMessage = spec.message

  } else if (objToString.call(spec.message) === '[object String]') {
    getMessage = createFormatter(spec.message)

  } else {
    throw new Error('Invalid spec.message: ' + spec.message + '.')

  }

  var CustomError = function () {
    Error.call(this)

    if (Error.captureStackTrace) {
      /* eslint-disable no-caller */
      Error.captureStackTrace(this, arguments.callee)
      /* eslint-enable no-caller */

    } else {
      this.stack = (new Error()).stack

    }

    this.message = getMessage.apply(null, Array.prototype.slice.call(arguments))
  }
  CustomError.prototype = Object.create(parent.prototype)
  CustomError.prototype.name = parent.prototype.name + spec.name

  parent[spec.name] = CustomError

  if (objToString.call(spec.errors) === '[object Array]') {
    for (var idx = 0, length = spec.errors.length; idx < length; ++idx) {
      module.exports.extend(CustomError, spec.errors[idx])
    }
  }

  return CustomError
}

/**
 * @param {string} name
 * @param {string} message
 * @param {function} [parent=Error]
 */
module.exports.createError = function createError (name, message, parent) {
  if (typeof parent === 'undefined') {
    parent = Error
  }

  return module.exports.extend(parent, {name: name, message: message})
}
