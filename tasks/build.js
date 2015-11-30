var copy = require('./copy.js');

copy.clean();

copy.templates(copy.getData());

copy.styles();

copy.images();
