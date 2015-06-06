/* global describe, it */

var expect = require('chai').expect
var typeforce = require('../lib/typeforce')

describe('typeforce', function () {
  describe('enforceErrorSpec', function () {
    function getFn () {
      var args = arguments
      return function () {
        typeforce.enforceErrorSpec.apply(null, args)
      }
    }

    it('must be an object', function () {
      var spec = null
      expect(getFn(spec)).to.throw(TypeError, /Object/)
    })

    it('name must be a string', function () {
      var spec = {name: 1}
      expect(getFn(spec)).to.throw(TypeError, /name/)
    })

    it('name is not empty string', function () {
      var spec = {name: ''}
      expect(getFn(spec)).to.throw(TypeError, /empty string/)
    })

    it('message are missing', function () {
      var spec = {name: 'custom'}
      expect(getFn(spec)).to.throw(TypeError, /message/)
    })

    it('errors is undefined', function () {
      var spec = {name: 'custom', message: 'h1'}
      expect(getFn(spec)).to.not.throw(TypeError)
    })

    it('errors not an array', function () {
      var spec = {name: 'custom', message: 'h1', errors: {}}
      expect(getFn(spec)).to.throw(TypeError, /errors/)
    })

    it('recursive check', function () {
      var spec = {name: 'custom', message: 'h1', errors: [{name: ''}]}
      expect(getFn(spec)).to.throw(TypeError, /name/)
    })
  })
})
