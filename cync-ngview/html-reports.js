const tslintHtmlReport = require('tslint-html-report');
tslintHtmlReport({
  tslint: 'tslint.json', // path to tslint.json
  srcFiles: 'cync-app/**/*.ts', // files to lint
  outDir: 'dist/tslint-html-report', // output folder to write the report to
  html: 'tslint-report.html', // name of the html report generated
  exclude: ['node_modules/**/*.ts'], // Files/patterns to exclude
  breakOnError: false, // Should it throw an error in tslint errors are found
  typeCheck: true, // enable type checking. requires tsconfig.json
  tsconfig: 'tsconfig.json' // path to tsconfig.json
});