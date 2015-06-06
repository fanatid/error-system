/**
 * @param {*} value
 * @return {string}
 */
module.exports.getName = function getName (value) {
  return Object.prototype.toString.call(value).slice(8, -1)
}
