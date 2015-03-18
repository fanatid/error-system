/* global describe, it, afterEach */

var expect = require('chai').expect
var errorSystem = require('../lib')
var extend = errorSystem.extend
var createError = errorSystem.createError

function testCustomError (PError, cName, cArgs, cMessage) {
  var CError = PError[cName]
  expect(CError).to.be.a('Function')
  var CErrorConstructor = Function.prototype.bind.apply(CError, [null].concat(cArgs))
  var custom = new CErrorConstructor()
  expect(custom).to.be.instanceof(PError)
  expect(custom).to.be.instanceof(CError)
  expect(custom.message).to.equal(cMessage)
}

describe('extend', function () {
  it('invalid parent', function () {
    function fn () { extend('') }
    expect(fn).to.throw(TypeError, /parent/)
  })

  it('invalid spec', function () {
    function fn () { extend(Error, '') }
    expect(fn).to.throw(TypeError, /Object/)
  })

  it('spec.message a function', function () {
    function getMessage () {
      return 'arguments: ' + Array.prototype.join.call(arguments, ',')
    }
    extend(Error, [{name: 'Custom2', message: getMessage}])
    testCustomError(Error, 'Custom2', ['a', 'b'], 'arguments: a,b')
  })

  it('spec.message a string', function () {
    extend(Error, {name: 'Custom3', message: 'arguments: {0},{1},{2}'})
    testCustomError(Error, 'Custom3', ['a', 'b'], 'arguments: a,b,{2}')
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

    extend(Error, spec)
    testCustomError(Error, 'Custom4', [], 'Custom4: 123')
    testCustomError(Error.Custom4, 'Custom5', [], 'Custom5: 234')
    testCustomError(Error.Custom4.Custom5, 'Custom6', [], 'Custom6: 345')
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
      expect(custom21.stack.split('\n')[1]).to.match(/CustomError/)
      expect(custom21.stack.split('\n')[2]).to.match(/Context\.<anonymous>/)
    })

    it('use captureStackTrace for stack', function () {
      if (Error.captureStackTrace === undefined) {
        return
      }

      var Custom22 = createError('Custom22', '{0}', Error)
      var custom22 = new Custom22()
      expect(custom22.stack.split('\n')[0]).to.equal('ErrorCustom22: {0}')
      expect(custom22.stack.split('\n')[1]).to.match(/Context\.<anonymous>/)
    })
  })
})

describe('createError', function () {
  it('with default parent (as Error)', function () {
    createError('Custom10', 'Custom10: {0}')
    testCustomError(Error, 'Custom10', ['h1'], 'Custom10: h1')
  })

  it('with custom parent', function () {
    function OtherError () {}
    createError('Custom11', 'Custom11: {0}', OtherError)
    testCustomError(OtherError, 'Custom11', ['h1'], 'Custom11: h1')
  })
})
