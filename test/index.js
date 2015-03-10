/* global describe, it */

var expect = require('chai').expect
var errorSystem = require('../lib')
var extend = errorSystem.extend
var createError = errorSystem.createError

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
    expect(Custom2).to.be.a('Function')
    expect(Error.Custom2).to.equal(Custom2)
    var custom2 = new Custom2('a', 'b')
    expect(custom2).to.be.instanceof(Error)
    expect(custom2).to.be.instanceof(Custom2)
    expect(custom2.message).to.equal('arguments: a,b')
  })

  it('spec.message a string', function () {
    var Custom3 = extend(Error, {name: 'Custom3', message: 'arguments: {0},{1},{2}'})
    expect(Custom3).to.be.a('Function')
    expect(Error.Custom3).to.equal(Custom3)
    var custom3 = new Custom3('a', 'b')
    expect(custom3).to.be.instanceof(Error)
    expect(custom3).to.be.instanceof(Custom3)
    expect(custom3.message).to.equal('arguments: a,b,{2}')
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

    function testCustomError (CustomError, ParentError, errorName, expectedMessage) {
      expect(CustomError).to.be.a('Function')
      expect(ParentError[errorName]).to.equal(CustomError)
      var custom = new CustomError()
      expect(custom).to.be.instanceof(ParentError)
      expect(custom).to.be.instanceof(CustomError)
      expect(custom.message).to.equal(expectedMessage)
    }

    var Custom4 = extend(Error, spec)
    testCustomError(Custom4, Error, 'Custom4', 'Custom4: 123')
    testCustomError(Custom4.Custom5, Custom4, 'Custom5', 'Custom5: 234')
    testCustomError(Custom4.Custom5.Custom6, Custom4.Custom5, 'Custom6', 'Custom6: 345')
  })
})

describe('createError', function () {
  it('with default parent (as Error)', function () {
    var Custom10 = createError('Custom10', 'Custom10: {0}')
    expect(Custom10).to.be.a('Function')
    expect(Error.Custom10).to.equal(Custom10)
    var custom10 = new Custom10('h1')
    expect(custom10).to.be.instanceof(Error)
    expect(custom10).to.be.instanceof(Custom10)
    expect(custom10.message).to.equal('Custom10: h1')
  })

  it('with custom parent', function () {
    function OtherError () {}
    var Custom11 = createError('Custom11', 'Custom11: {0}', OtherError)
    expect(Custom11).to.be.a('Function')
    expect(OtherError.Custom11).to.equal(Custom11)
    var custom11 = new Custom11('h1')
    expect(custom11).to.be.instanceof(OtherError)
    expect(custom11).to.be.instanceof(Custom11)
    expect(custom11.message).to.equal('Custom11: h1')
  })
})
