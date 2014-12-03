var utils = module.exports;

utils.isValidUrl = function(url) {
	'use strict';
	if (typeof url !== 'string') return false;

	var expression = "^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|(www\\.)?){1}([0-9A-Za-z-\\.@:%_+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?";
	var regex = new RegExp(expression);
	if (url.match(regex)) {
		return true;
	} else {
		return false;
	}
};