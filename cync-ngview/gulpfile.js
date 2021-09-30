'use strict';
const { task, src, dest, watch, series } = require('gulp');
const eslint = require('gulp-eslint');
const tslint = require('gulp-tslint');
const reporter = require('eslint-html-reporter');
const path     = require('path');
const fs       = require('fs');
const tslintHtmlReport = require('tslint-html-report');
const runcmd = require('gulp-run');
const Server = require('karma').Server;

function karma(done){
  new Server({
      configFile: __dirname + '/karma.conf.js'
  }, done).start();
}

function tsCheck() {

  return src("cync-app/**/*.ts", { base: '.' }).pipe(tslint({
      formatter: "json"
  })).pipe(tslint.report({
    allowWarnings: true
  }));

}
function js() {
  return src(['cync-app/assets/js/custom.js','!node_modules/**'])
        .pipe(eslint())
        .pipe(eslint.result(result => {
           // Called for each ESLint result.
          console.log(`ESLint result: ${result.filePath}`);
          console.log(`# Messages: ${result.messages.length}`);
          console.log(`# Warnings: ${result.warningCount}`);
          console.log(`# Errors: ${result.errorCount}`);
        }))
        .pipe(dest("reports/static-code-reports/"))
        .pipe(eslint.format(reporter, function(report) {
              fs.writeFileSync(path.join(__dirname+'/reports/static-code-reports', 'javascript-report.html'), report);
        }));
}

function tsReport(){
  return  tslintHtmlReport({
    tslint: 'tslint.json', // path to tslint.json
    srcFiles: 'cync-app/**/*.ts', // files to lint
    outDir: 'reports/static-code-reports', // output folder to write the report to
    html: 'typescript-report.html', // name of the html report generated
    exclude: ['node_modules/**/*.ts'], // Files/patterns to exclude
    breakOnError: false, // Should it throw an error in tslint errors are found
    typeCheck: true, // enable type checking. requires tsconfig.json
    tsconfig: 'tsconfig.json' // path to tsconfig.json
  });

}

function indexHtml() {
  var wStream = fs.createWriteStream(path.join(__dirname+'/reports/static-code-reports/','index.html'));        
  const title='Static Code Analysis Reports and Code Coverage';
  const style=` body { font-size:13px;  margin:0px  auto; padding:0px;}
               .header{ height:80px; border-bottom:1px solid #aaaa;  width:98%;  }
               .header * { display:inline-block; margin:10px;  vertical-align: text-top;  }
               .header strong { font-size:20px; margin-top:22px;}
               .container_body{ 
                     border: 0px solid blue;
                     width:98%;
                     height:60vh;
                 }
               .col_1{ width:100% height:32px; background:#F1F1F1; }
               .col_2{ width:100%;}
               .navalist{ width:100%; list-style:none; margin:0px; padding:8px; }
               .navalist li { display:inline-block; padding:2px 10px; white-space: nowrap; }
               .navalist li a {font-size:15px; text-decoration:none; }
               .frame_page{height:80vh; width:100%; border:0px solid #000;  }
             `;
  const lint_page=`<ul class="navalist">  
                <li><a href="javascript-report.html" target="frame_page"> Java Script Reports</a> </li>
                <li><a href="typescript-report.html" target="frame_page"> Typescript Angular code reports</a> </li>                      
              </ul>`;
  const frame_container=`<iframe name="frame_page" class="frame_page" frameborder="0" src="css-report.html" id="frame_page"></iframe>`;
  wStream.write(`<!DOCTYPE html><html><head><title>${title}</title>`);
  wStream.write(`<style>${style}</style></head><body>`);
  wStream.write(`<div class="header"> <img src='data:image/png;base64,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' /> <strong> ${title}</strong> </div>`);
  wStream.write(`<div class="container_body"> <div class="col_1">${lint_page} </div> <div class="col_2">${frame_container}</div>`);
  wStream.write("</div></body></html>");
  wStream.end();
  return wStream;
}

function build(){
  let isSuccess = true;
  return runcmd('npm run build',{ verbosity: 3 }).exec()
       .on('end',() => {
         if(isSuccess){ console.log("Ya Success!"); }
        });
}
function chromeHeadless(){
  let isSuccess = true;
    return runcmd('apt-get install chromium-browser -y && export CHROME_BIN=/usr/bin/chromium-browser && npm run test:headless', { verbosity: 3 }).exec()
     .on('end',() => {
        if(isSuccess){ console.log("Ya Success!"); }
     });
}

// Exports function 

exports.karma = karma;
exports.tsCheck= tsCheck;
exports.js = js;
exports.indexHtml = indexHtml;
exports.build = build;
exports.chromeHeadless = chromeHeadless;

exports.default = series(tsCheck, js, indexHtml);
