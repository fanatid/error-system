/* global describe, it, afterEach */

var expect = require('chai').expect
var errorSystem = require('../lib')
var extend = errorSystem.extend
var createError = errorSystem.createError

function testCustomError (CError, PError, ceName, ceArgs, ceMessage) {
  expect(CError).to.be.a('Function')
  expect(PError[ceName]).to.equal(CError)
  var CErrorConstructor = Function.prototype.bind.apply(CError, [null].concat(ceArgs))
  var custom = new CErrorConstructor()
  expect(custom).to.be.instanceof(PError)
  expect(custom).to.be.instanceof(CError)
  expect(custom.message).to.equal(ceMessage)
}

describe('extend', function () {
  it('invalid parent', function () {
    function fn () { extend('') }
    expect(fn).to.throw(Error, 'Parent for extending must be a function.')
  })

  it('invalid spec', function () {
    function fn () { extend(Error, '') }
    expect(fn).to.throw(Error, 'Spec for extending parent must be an Object.')
  })

  it('invalid spec.name (missing)', function () {
    function fn () { extend(Error, {}) }
    expect(fn).to.throw(Error, 'Invalid spec.name: undefined.')
  })

  it('invalid spec.name (empty string)', function () {
    function fn () { extend(Error, {name: ''}) }
    expect(fn).to.throw(Error, 'Invalid spec.name: .')
  })

  it('invalid spec.message (missing)', function () {
    function fn () { extend(Error, {name: 'Custom1'}) }
    expect(fn).to.throw(Error, 'Invalid spec.message: undefined.')
  })

  it('spec.message a function', function () {
    function getMessage () {
      return 'arguments: ' + Array.prototype.join.call(arguments, ',')
    }
    var Custom2 = extend(Error, {name: 'Custom2', message: getMessage})
    testCustomError(Custom2, Error, 'Custom2', ['a', 'b'], 'arguments: a,b')
  })

  it('spec.message a string', function () {
    var Custom3 = extend(Error, {name: 'Custom3', message: 'arguments: {0},{1},{2}'})
    testCustomError(Custom3, Error, 'Custom3', ['a', 'b'], 'arguments: a,b,{2}')
  })

  it('recursive extend via errors', function () {
    var spec = {
      name: 'Custom4',
      message: 'Custom4: 123',
      errors: [
        {
          name: 'Custom5',
          message: 'Custom5: 234',
          errors: [
            {
              name: 'Custom6',
              message: 'Custom6: 345'
            }
          ]
        }
      ]
    }

    var Custom4 = extend(Error, spec)
    testCustomError(Custom4, Error, 'Custom4', [], 'Custom4: 123')

    var Custom5 = Custom4.Custom5
    testCustomError(Custom5, Custom4, 'Custom5', [], 'Custom5: 234')

    var Custom6 = Custom5.Custom6
    testCustomError(Custom6, Custom5, 'Custom6', [], 'Custom6: 345')
  })
})

describe('createError', function () {
  it('with default parent (as Error)', function () {
    var Custom10 = createError('Custom10', 'Custom10: {0}')
    testCustomError(Custom10, Error, 'Custom10', ['h1'], 'Custom10: h1')
  })

  it('with custom parent', function () {
    function OtherError () {}
    var Custom11 = createError('Custom11', 'Custom11: {0}', OtherError)
    testCustomError(Custom11, OtherError, 'Custom11', ['h1'], 'Custom11: h1')
  })
})

describe('stack property', function () {
  var captureStackTrace = Error.captureStackTrace

  afterEach(function () {
    Error.captureStackTrace = captureStackTrace
  })

  it('use (new Error()).stack for stack', function () {
    delete Error.captureStackTrace

    var Custom21 = createError('Custom21', '{0}', Error)
    var custom21 = new Custom21()
    expect(custom21.stack.split('\n')[0]).to.equal('Error')
    expect(custom21.stack.split('\n')[2]).to.match(/test\/index\.js/)
  })

  it('use captureStackTrace for stack', function () {
    if (typeof Error.captureStackTrace === 'undefined') {
      return
    }

    var Custom22 = createError('Custom22', '{0}', Error)
    var custom22 = new Custom22()
    expect(custom22.stack.split('\n')[0]).to.equal('ErrorCustom22: {0}')
    expect(custom22.stack.split('\n')[1]).to.match(/test\/index\.js/)
  })
})
