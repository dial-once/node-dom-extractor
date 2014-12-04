var utils 		= require('./dom-utils'),
	jsdom 		= require('jsdom'),
	juice 		= require('juice'),
	NodeCache 	= require('node-cache'),
	extractor 	= module.exports;

var nodeCache 	= new NodeCache();

function jsdomCallback(cacheKey, document, callback) {
	juice.juiceDocument(document, {
		url: 'fake'
	}, function() {
		if(cacheKey !== null){
			nodeCache.set(cacheKey, document.body.innerHTML);
		}
		callback(document.body.innerHTML);
	});
}

extractor.fetch = function(data, selector, callback) {
	var cacheKey 	= null;
	var isValidUrl 	= utils.isValidUrl(data);

	if(isValidUrl){
		cacheKey 		= data + '#' + selector;
		var cachedValue = nodeCache.get(cacheKey);
		
		if(cachedValue[cacheKey] !== undefined){
			callback(cachedValue[cacheKey]);
			return;
		}
	}

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

			if (isValidUrl) {
				$('link').each(function() {
					$(this).attr('href', utils.relToAbs(data, $(this).attr('href')));
				});
				$('img').each(function() {
					$(this).attr('src', utils.relToAbs(data, $(this).attr('src')));
				});
				$('a').each(function() {
					$(this).attr('href', utils.relToAbs(data, $(this).attr('href')));
				});
			}
			jsdomCallback(cacheKey, window.document, callback);
		}
	};

	if (isValidUrl) {
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