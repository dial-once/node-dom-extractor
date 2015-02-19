var utils = require('./dom-utils'),
	cheerio = require('cheerio'),
	request = require('request'),
	juice = require('juice'),
	NodeCache = require('node-cache'),
	extractor = module.exports,
	cssom = require('cssom');

var nodeCache = new NodeCache();

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

	if (options.removeLinks === undefined) {
		options.removeLinks = false;
	}

	if (options.inlineCss === undefined) {
		options.inlineCss = true;
	}
	if (options.innerText === undefined) {
		options.innerText = false;
	}

	return options;
}

function removeLinks($) {
	$('a').remove();
}

function cssCallback($, options, callback) {
	try {
		if (options.removeLinks) {
			removeLinks($);
		}
		$('body').html($(options.selector) || '');
		$('head').append('<style>' + options.extraCss + '</style>');
		var cacheKey = options.data + '#' + options.selector + '#css' + options.inlineCss + '#innerText' + options.innerText;
		nodeCache.set(cacheKey, juice.juiceDocument($, {
			extraCss: options.extraCss || ''
		})('body').html());
		callback(nodeCache.get(cacheKey)[cacheKey]);
	} catch (e) {
		callback();
	}
}

function inlineCss($, options, callback) {
	var link = $('link[rel="stylesheet"]').first();
	if (link.attr('href') === undefined) {
		cssCallback($, options, callback);
	} else {
		request({
			uri: link.attr('href'),
		}, function(error, response, body) {
			try {
				cssom.parse(body);
			} catch (e) {
				body = '';
			}
			$('head').append('<style>' + body + '</style>');
			link.remove();
			inlineCss($, options, callback);
		});
	}
}

function domCallback(html, options, callback) {
	var $ = cheerio.load(html);
	$('script').remove();

	if (options.isValidUrl) {
		cleanRelativePathes($, options.data);
	}

	inlineCss($, options, callback);
}

extractor.fetch = function(data, options, callback) {
	var cacheKey = null;
	var isValidUrl = utils.isValidUrl(data);

	if (options instanceof Function) {
		callback = options;
		options = undefined;
	}

	options = cleanOptions(options);
	options.isValidUrl = isValidUrl;

	if (isValidUrl) {
		cacheKey = data + '#' + options.selector + '#css' + options.inlineCss + '#innerText' + options.innerText;
		var cachedValue = nodeCache.get(cacheKey);

		if (cachedValue[cacheKey] !== undefined) {
			callback(cachedValue[cacheKey]);
			return;
		}
	}

	if (isValidUrl) {
		if (data.indexOf('http') !== 0) {
			data = 'http://' + data;
		}
		options.data = data;
		request({
			uri: data,
		}, function(error, response, body) {
			domCallback(body, options, callback);
		});
	} else {
		domCallback(data, options, callback);
	}
};


extractor.middleware = function(options) {
	return function(req, res, next) {
		var params = require('url').parse(req.url, true).query;
		if (params.url !== undefined && params.selector !== undefined) {
			params.selector = params.selector.replace('|sharp|', '#');
			if (params.extraCss !== undefined) {
				params.extraCss = params.extraCss.replace('|sharp|', '#');
			}
			extractor.fetch(params.url, {
				selector: params.selector,
				extraCss: params.extraCss,
				removeLinks: params.removeLinks || false
			}, function(response) {
				if (response !== undefined) {
					res.write(response);
				}
				res.end();
			});
		} else {
			next();
		}
	};
};