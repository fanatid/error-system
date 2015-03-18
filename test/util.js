/* global describe, it */

var expect = require('chai').expect
var util = require('../lib').util

describe('util', function () {
  describe('createFormatter', function () {
    it('replace all matches', function () {
      var msg = util.createFormatter('a{0}, {1}')('b', 2)
      expect(msg).to.equal('ab, 2')
    })

    it('not enough arguments', function () {
      var msg = util.createFormatter('{0}, b{1}')('a')
      expect(msg).to.equal('a, b{1}')
    })
  })
})
