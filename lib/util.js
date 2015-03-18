/**
 * @param {string} message
 * @return {function}
 */
function createFormatter (message) {
  return function messageFormatter () {
    var args = arguments
    return message.replace(/{(\d+)}/g, function (match, index) {
      return args[index] !== undefined
        ? args[index]
        : match
    })
  }
}

module.exports = {
  createFormatter: createFormatter
}
