module.exports = function (config) {
  config.set({
    browsers: ['Firefox'],
    frameworks: ['detectBrowsers', 'mocha'],
    detectBrowsers: {
      enabled: true,
      usePhantomJS: false,
      postDetection: function (availableBrowser) {
        var browsers = ['Chrome', 'Firefox']
        return browsers.filter(function (browser) {
          return availableBrowser.indexOf(browser) !== -1
        })
      }
    },
    singleRun: true,
    files: ['error-system.test.js'],
    plugins: [
      'karma-mocha',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-detect-browsers'
    ]
  })
}
