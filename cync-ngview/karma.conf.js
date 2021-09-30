const path = require('path');
module.exports = function (config) {
  config.set({
    basePath: '',
    files: [
      {pattern : 'cync-app/assets/vendors/jquery/js/jquery.min.js'},
      {pattern : 'cync-app/assets/vendors/bootstrap/js/bootstrap.min.js'},
      {pattern : 'cync-app/assets/vendors/jquery/js/jquery.event.tap.js'},
      {pattern : 'cync-app/assets/vendors/bootstrap-calender/js/bootstrap-year-calendar.js'},
      {pattern : 'cync-app/assets/images/icons/favicon-cync.ico'},
      {pattern : 'cync-app/assets/vendors/bootstrap-calender/css/bootstrap-year-calendar.min.css'},
      {pattern : 'cync-app/assets/vendors/font-awesome/css/font-awesome.min.css'},
      {pattern : 'cync-app/assets/css/_variables_cync_global.scss'},
      {pattern : 'cync-app/assets/css/style.scss'},
      {pattern : 'cync-app/assets/css/angular-dev.scss'},
      'https://code.jquery.com/jquery-3.5.1.min.js'
    ],
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma'),
      require('karma-scss-preprocessor')
    ],
    client:{
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      dir: path.join(__dirname + '/reports', 'code-coverage'),
      reports: [ 'html', 'lcovonly','text-summary'],
      fixWebpackSourcePaths: true,
      combineBrowserReports: true,
      // enforce percentage thresholds
      thresholds: {
        emitWarning: true, // set to `true` to not fail the test command when thresholds are not met
        global: { // thresholds for all files
          statements: 70,
          lines: 70,
          branches: 70,
          functions: 70
        }
      }
    },
    
    reporters: ['coverage-istanbul','progress', 'kjhtml'],
    customLaunchers: {
        ChromeHeadless: {
            base: 'Chrome',
            flags: [
                '--headless',
                '--disable-gpu',
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-web-security',
                '--disable-translate',
                '--disable-extensions',
                '--remote-debugging-port=9222'
            ]
        }
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch:true,
    browsers: ['Chrome','ChromeHeadless'],
    singleRun: false,
    browserNoActivityTimeout: 100000,
    concurrency: Infinity,
    preprocessors: {
      'cync-app/assets/**/*.scss': ['scss']
    }
  });
};