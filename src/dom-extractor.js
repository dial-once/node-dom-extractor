var utils = require('./dom-utils'),
	jsdom = require('jsdom'),
	juice = require('juice'),
	extractor = module.exports;

function jsdomCallback(errors, document, callback) {
	juice.juiceDocument(document, {url: 'fake'}, function(error){
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
			jsdomCallback(errors, window.document, callback);
		}
	};

	if (utils.isValidUrl(data)) {
		jsdomconfig.url = data;
	} else if (typeof data !== 'string') {
		if (data instanceof Function) callback();
		return;
	} else {
		jsdomconfig.html = data;
	}

	jsdom.env(jsdomconfig);
};