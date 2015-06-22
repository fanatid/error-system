/**
 * @param {*} value
 * @return {string}
 */
module.exports.getName = function (value) {
  return Object.prototype.toString.call(value).slice(8, -1)
}

/**
 * @param {string} string
 * @return {function}
 */
module.exports.stringTemplate = function (string) {
  var nargs = /\{[0-9a-zA-Z]+\}/g
  var replacements = string.match(nargs) || []
  var interleave = string.split(nargs)
  var replace = []

  interleave.forEach(function (current, index) {
    replace.push({type: 'raw', value: current})

    var replacement = replacements[index]
    if (replacement && replacement.length > 2) {
      var escapeLeft = current[current.length - 1]
      var escapeRight = (interleave[index + 1] || [])[0]
      replace.push({
        type: escapeLeft === '{' && escapeRight === '}' ? 'raw' : 'tpl',
        value: replacement.slice(1, -1)
      })
    }
  })

  // join raw values
  replace = replace.reduce(function (result, current, index) {
    if (current.type === 'tpl' || result.length === 0) {
      result.push(current)
    } else {
      var prevIndex = result.length - 1
      if (result[prevIndex].type === 'raw') {
        result[prevIndex].value += current.value
      } else {
        result.push(current)
      }
    }

    return result
  }, [])

  return function () {
    var args = arguments.length === 1 && module.exports.getName(arguments[0]) === 'Object'
                 ? arguments[0]
                 : arguments

    // not map (arguments willl slow)
    var values = []
    for (var idx = 0; idx < replace.length; ++idx) {
      var current = replace[idx]

      var value = ''
      if (current.type === 'raw') {
        value = current.value
      } else if (args[current.value] !== undefined) {
        value = args[current.value]
      }

      values.push(value)
    }

    return values.join('')
  }
}
