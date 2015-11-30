var watch = require('chokidar');
var copy = require('./copy.js');
var debug = require('debug')('watch');

var data = copy.getData();
// data changes
watch.watch('./src/?(*.json|*.md)', {ignored: /[\/\\]\./}).on('all', function () {
  debug('Data file changed');
  copy.clean('**/*.html');
  data = copy.getData();
  copy.templates(data);
  debug('Templates updated.');
});

watch.watch('./src/*.mustache', {ignored: /[\/\\]\./}).on('all', function () {
  debug('Template changed.');
  copy.clean('**/*.html');

  copy.templates(data);
  debug('Templates updated.');
});

watch.watch('./src/*.less', {ignored: /[\/\\]\./}).on('all', function () {
  debug('Less file changed.');
  copy.clean('**/*.css');

  copy.styles();
  debug('Styles updated.');
});

watch.watch('./src/images/*.*', {ignored: /[\/\\]\./}).on('all', function () {
  debug('Image file changed.');
  copy.clean('images/');

  copy.images();
  debug('Image files updated.');
});
