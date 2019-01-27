const path = require('path');
const nunjucks = require('nunjucks');
const { debug } = require('../etc/config');

nunjucks.configure(path.join(__dirname, '..', 'views'), {
	autoescape: true,
	noCache: debug ? true : false
});

module.exports = nunjucks;
