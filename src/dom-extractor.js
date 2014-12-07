var utils = require('./dom-utils'),
	jsdom = require('jsdom'),
	juice = require('juice'),
	NodeCache = require('node-cache'),
	extractor = module.exports;

var nodeCache = new NodeCache();

function jsdomCallback($, cacheKey, options, document, callback) {
	if (document.body === null) {
		callback('');
		return;
	}

	if (options.inlineCss) {
		juice.juiceDocument(document, {
			url: 'fake'
		}, function() {
			if (cacheKey !== null) {
				nodeCache.set(cacheKey, document.body.innerHTML);
			}
			
			if (options.innerText) {
				callback($(document.body).text());
			} else {
				callback(document.body.innerHTML);
			}
		});
	} else {
		if (options.innerText) {
			callback($(document.body).text());
		} else {
			callback(document.body.innerHTML);
		}
	}
}

function cleanRelativePathes($, absoluteUrl) {
	$('link').each(function() {
		$(this).attr('href', utils.relToAbs(absoluteUrl, $(this).attr('href')));
	});
	$('img').each(function() {
		$(this).attr('src', utils.relToAbs(absoluteUrl, $(this).attr('src')));
	});
	$('a').each(function() {
		$(this).attr('href', utils.relToAbs(absoluteUrl, $(this).attr('href')));
	});
	$('form').each(function() {
		$(this).attr('action', utils.relToAbs(absoluteUrl, $(this).attr('action')));
	});
}


function cleanOptions(options) {
	
	if (options === undefined) {
		options.selector = 'body';
	} else if (typeof options === 'string') { // keeping compatiblity with version < v0.0.7
		if (options === '/') {
			options = {
				selector: 'body'
			};
		} else {
			options = {
				selector: options
			};
		}
	} else {
		options.selector = options.selector.replace('\\', '');
	}

	if(options.inlineCss === undefined){
		options.inlineCss = true;
	}
	if(options.innerText === undefined){
		options.innerText = false;
	}
	
	return options;
}

extractor.fetch = function(data, options, callback) {
	var cacheKey = null;
	var isValidUrl = utils.isValidUrl(data);

	if (options instanceof Function) {
		callback = options;
		options = undefined;
	}

	options = cleanOptions(options);

	if (isValidUrl) {
		cacheKey = data + '#' + options.selector + '#css' + options.inlineCss + '#innerText' + options.innerText;
		var cachedValue = nodeCache.get(cacheKey);

		if (cachedValue[cacheKey] !== undefined) {
			callback(cachedValue[cacheKey]);
			return;
		}
	}

	var jsdomconfig = {
		scripts: ["http://code.jquery.com/jquery.js"],
		done: function(errors, window) {
			var $ = window.$;

			$('body').html($(options.selector).wrap('<span/>').parent().html());
			$('script').remove();

			if (isValidUrl) {
				cleanRelativePathes($, data);
			}
			jsdomCallback($, cacheKey, options, window.document, callback);
		}
	};

	if (isValidUrl) {
		if (data.indexOf('http') !== 0) {
			data = 'http://' + data;
		}
		jsdomconfig.url = data;
	} else {
		jsdomconfig.html = data;
	}

	jsdom.env(jsdomconfig);
};


extractor.middleware = function(options) {
	return function(req, res, next) {
		var params = require('url').parse(req.url, true).query;
		if (params.url !== undefined && params.selector !== undefined) {
			params.selector = params.selector.replace('|sharp|', '#');
			extractor.fetch(params.url, {
				selector: params.selector
			}, function(response) {
				res.write(response);
				res.end();
			});
		} else {
			next();
		}
	};
};