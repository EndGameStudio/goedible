var Mustache = require('mustache');
var fileSave = require('file-save');
var read = require('read-file');
var less = require('less');
var marked = require('marked');
var glob = require('glob');
var path = require('path');
var xtend = require('xtend');
var fse = require('fs-extra');
var del = require('del');
var copy = {};
var debug = require('debug')('copy');

var checkDeepProperty = require('./checkDeepProp.js');

// Clear dist
copy.clean = function (pattern) {
    pattern = pattern ? pattern: '**';
    return del.sync(['dist/' + pattern, '!dist']);
};

copy.markdown = markdown = function (filePath) {
    return marked(read.sync(filePath, 'utf8'));
};

copy.getData = function () {
    var data = {};
    // Get JSON
    glob('./src/**/*.json', function (er, files) {
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            var fileName = path.basename(file, '.json');
            data[fileName] = JSON.parse(read.sync(file, 'utf8'));
            var hasMD = checkDeepProperty(data[fileName], 'markdown');
            debug(hasMD);
            if (hasMD && hasMD.length && hasMD.length > 0) {
                debug('JSON file has '+hasMD.length+' markdown items.');
                for (var j = 0; j < hasMD.length; j++) {
                    debug(hasMD[j]);
                    hasMD[j].content = markdown(__dirname + '/../src/'+hasMD[j].markdown);
                }

            }
        }
    });

    // Build content
    glob('./src/**/*.md', function (er, files) {
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            var fileName = path.basename(file, '.md');
            var md = markdown(file);
            data[fileName] = xtend(data[fileName] || {}, {content: md});
        }
    });

    return data;
};

// Build templates
copy.templates = function (data) {
    glob('./src/**/*.mustache', function (er, files) {
        for (var i = 0; i < files.length; i++) {
            var destPath;
            var file = files[i];
            var fileName = path.basename(file, '.mustache');
            // Get files
            var template = read.sync(file, 'utf8');
            // Build
            var indexFile = Mustache.render(template, data[fileName]);
            if (fileName === 'index') {
                destPath = './dist/'+fileName+'.html';
            } else {
                destPath = './dist/'+fileName+'/index.html';
            }

            var fileDef = fileSave(destPath)
                .write(indexFile, 'utf8')
                .end();

            fileDef.finish(function () {
                console.log(file + ' saved to ' + destPath);
            });

            fileDef.error(function () {
                console.log('error saving ' + fileName);
            });
        }
    });
};

// Build styles
copy.styles = function () {
    glob("./src/**/*.less", function (er, files) {
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            var fileName = path.basename(file, '.less');
            var styles = read.sync(file, 'utf8');
            var lessFile = less.render(styles, function (e, output) {
                var destPath = './dist/'+fileName+'.css';
                var lessDef = fileSave(destPath)
                    .write(output.css, 'utf8')
                    .end();

                lessDef.finish(function () {
                    console.log(file + ' saved to ' + destPath);
                });

                lessDef.error(function (e) {
                    console.log('error saving ' + fileName);
                });


            });
        };
    });
};

//copy Images
copy.images = function () {
    fse.copy('src/images/', 'dist/images/', function (err) {
        console.log('Images copied.');
    });
};

// glob('./src/images/*.*', function (err, files) {
//
// });

module.exports = copy;
