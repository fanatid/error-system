var util = require('./util')

var getMsg = util.stringTemplate(
  'Expected property `{name}` of type {expType}, got {gotType} for spec: {spec}')

/**
 * @param {ErrorSpec} value
 * @throws {TypeError}
 */
module.exports.enforceErrorSpec = function (spec) {
  var msg

  if (util.getName(spec) !== 'Object') {
    throw new TypeError('spec must be an Object')
  }

  if (util.getName(spec.name) !== 'String') {
    msg = getMsg({
      name: 'name',
      expType: 'String',
      gotType: util.getName(spec.name),
      spec: JSON.stringify(spec)
    })
    throw new TypeError(msg)
  }

  if (spec.name === '') {
    msg = 'Expect "name" not empty string (spec: ' + JSON.stringify(spec) + ')'
    throw new TypeError(msg)
  }

  if (['String', 'Function'].indexOf(util.getName(spec.message)) === -1) {
    msg = getMsg({
      name: 'message',
      expType: 'String or Function',
      gotType: util.getName(spec.message),
      spec: JSON.stringify(spec)
    })
    throw new TypeError(msg)
  }

  if (spec.errors !== undefined) {
    if (util.getName(spec.errors) !== 'Array') {
      msg = getMsg({
        name: 'errors',
        expType: 'Array',
        gotType: util.getName(spec.errors),
        spec: JSON.stringify(spec)
      })
      throw new TypeError(msg)
    }

    spec.errors.forEach(module.exports.enforceErrorSpec)
  }
}
