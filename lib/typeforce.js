var compileStringTemplate = require('string-template/compile')

var getName = require('./util').getName

var getMsg = compileStringTemplate(
  'Expected property `{name}` of type {expType}, got {gotType} for spec: {spec}')

/**
 * @param {ErrorSpec} value
 * @throws {TypeError}
 */
module.exports.enforceErrorSpec = function enforceErrorSpec (spec) {
  var msg

  if (getName(spec) !== 'Object') {
    throw new TypeError('spec must be an Object')
  }

  if (getName(spec.name) !== 'String') {
    msg = getMsg({
      name: 'name',
      expType: 'String',
      gotType: getName(spec.name),
      spec: JSON.stringify(spec)
    })
    throw new TypeError(msg)
  }

  if (spec.name === '') {
    msg = 'Expect "name" not empty string (spec: ' + JSON.stringify(spec) + ')'
    throw new TypeError(msg)
  }

  if (['String', 'Function'].indexOf(getName(spec.message)) === -1) {
    msg = getMsg({
      name: 'message',
      expType: 'String or Function',
      gotType: getName(spec.message),
      spec: JSON.stringify(spec)
    })
    throw new TypeError(msg)
  }

  if (spec.errors !== undefined) {
    if (getName(spec.errors) !== 'Array') {
      msg = getMsg({
        name: 'errors',
        expType: 'Array',
        gotType: getName(spec.errors),
        spec: JSON.stringify(spec)
      })
      throw new TypeError(msg)
    }

    spec.errors.forEach(enforceErrorSpec)
  }
}
