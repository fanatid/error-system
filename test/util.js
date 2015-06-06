/* global describe, it */

var expect = require('chai').expect
var util = require('../lib/util')

describe('util', function () {
  describe('getName', function () {
    var objs = {
      'Array': [],
      'Function': function () {},
      'Null': null,
      'Object': {},
      'String': '',
      'Undefined': undefined
    }

    Object.keys(objs).forEach(function (key) {
      it(key, function () {
        expect(util.getName(objs[key])).to.equal(key)
      })
    })
  })
})
