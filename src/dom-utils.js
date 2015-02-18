var url = require('url'),
	utils = module.exports;

utils.isValidUrl = function(uri) {
	'use strict';
	if (typeof uri !== 'string') {
		return false;
	}

	var expression = "^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|(www\\.)?){1}([0-9A-Za-z-\\.@:%_+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?";
	var regex = new RegExp(expression);
	if (uri.match(regex)) {
		return true;
	} else {
		return false;
	}
};

//see http://stackoverflow.com/questions/7544550/javascript-regex-to-change-all-relative-urls-to-absolute
utils.relToAbs = function(a, b) {
	if(a === undefined || b === undefined){
		return b;
	}
	return url.format(url.resolve(url.parse(a), url.parse(b)));
};