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

  describe('stringTemplate', function () {
    it('Named arguments are replaced', function () {
      var result = util.stringTemplate('Hello {name}, how are you?')({
        name: 'Mark'
      })
      expect(result).to.equal('Hello Mark, how are you?')
    })

    it('Named arguments can be escaped', function () {
      var result = util.stringTemplate('Hello {{name}}, how are you?')({
        name: 'Mark'
      })
      expect(result).to.equal('Hello {name}, how are you?')
    })

    it('Array arguments are replaced', function () {
      var result = util.stringTemplate('Hello {0}, how are you?')(['Mark'])
      expect(result).to.equal('Hello Mark, how are you?')
    })

    it('Template string without arguments', function () {
      var result = util.stringTemplate('Hello, how are you?')()
      expect(result).to.equal('Hello, how are you?')
    })

    it('Not full escaped argument is latest', function () {
      var result = util.stringTemplate('Hello {{name}')({
        name: 'Mark'
      })
      expect(result).to.equal('Hello {Mark')
    })

    it('Missing named arguments become 0 characters', function () {
      var result = util.stringTemplate('Hello{name}, how are you?')({})
      expect(result).to.equal('Hello, how are you?')
    })
  })
})
