var utils = require('./dom-utils'),
	jsdom = require('jsdom'),
	juice = require('juice'),
	extractor = module.exports;

function jsdomCallback(errors, document, callback) {
	juice.juiceDocument(document, {
		url: 'fake'
	}, function() {
		callback(document.body.innerHTML);
	});
}

extractor.fetch = function(data, selector, callback) {
	if (selector instanceof Function) {
		callback = selector;
		selector = 'body';
	} else if (typeof selector !== 'string') {
		selector = 'body';
	}

	var jsdomconfig = {
		scripts: ["http://code.jquery.com/jquery.js"],
		done: function(errors, window) {
			var $ = window.$;
			$('body').html($(selector).wrap('<span/>').parent().html());
			$('script').remove();
			if (utils.isValidUrl(data)) {
				$('link').each(function(index) {
					$(this).attr('href', utils.relToAbs(data, $(this).attr('href')));
				});
			}
			jsdomCallback(errors, window.document, callback);
		}
	};

	if (utils.isValidUrl(data)) {
		if (data.indexOf('http') !== 0) {
			data = 'http://' + data;
		}
		jsdomconfig.url = data;
	} else if (typeof data !== 'string') {
		if (data instanceof Function) {
			callback();
		}
		return;
	} else {
		jsdomconfig.html = data;
	}

	jsdom.env(jsdomconfig);
};

extractor.middleware = function(options) {
	return function(req, res, next) {
		var params = require('url').parse(req.url, true).query;
		if (params.url !== undefined && params.selector !== undefined) {
			extractor.fetch(params.url, params.selector, function(response) {
				res.write(response);
				res.end();
			});
		} else {
			next();
		}
	};
};