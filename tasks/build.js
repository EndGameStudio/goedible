var Mustache = require('mustache');
var fileSave = require('file-save');
var read = require('read-file');
var less = require('less');
var marked = require('marked');

var data = require('../src/index.json');

// Render markdown
var md = read.sync('./src/content.md', 'utf8');

//add markdown to data
data.content = marked(md);

// Build templates
// Get files
var template = read.sync('./src/index.mustache', 'utf8');
// Build
var indexFile = Mustache.render(template, data);
var fileDef = fileSave('./dist/index.html')
    .write(indexFile, 'utf8')
    .end();

fileDef.finish(function () {
    console.log('file saved!');
});

fileDef.error(function () {
    console.log('error saving file!');
});

// Build styles
var styles = read.sync('./src/index.less', 'utf8');
var lessFile = less.render(styles, function (e, output) {
    var lessDef = fileSave('./dist/styles.css')
        .write(output.css, 'utf8')
        .end();

    lessDef.finish(function () {
        console.log('file saved!');
    });

    lessDef.error(function (e) {
        console.log('error saving file!');
    });

});
