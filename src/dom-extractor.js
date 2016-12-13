const utils = require('./dom-utils');
const cheerio = require('cheerio');
const request = require('request');
const juice = require('juice');
const NodeCache = require('node-cache');
const cssom = require('cssom');
const url = require('url');

const extractor = module.exports;

const nodeCache = new NodeCache();

function cleanRelativePathes($, absoluteUrl) {
  $('link').each(() => {
    $(this).attr('href', utils.relToAbs(absoluteUrl, $(this).attr('href')));
  });
  $('img').each(() => {
    $(this).attr('src', utils.relToAbs(absoluteUrl, $(this).attr('src')));
  });
  $('a').each(() => {
    $(this).attr('href', utils.relToAbs(absoluteUrl, $(this).attr('href')));
  });
  $('form').each(() => {
    $(this).attr('action', utils.relToAbs(absoluteUrl, $(this).attr('action')));
  });
}
/* eslint no-param-reassign: "off" */
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
    $('head').append(`<style>${options.extraCss}</style>`);
    const cacheKey = `${options.data}#${options.selector}#css${options.inlineCss}#innerText${options.innerText}`;
    nodeCache.set(cacheKey, juice.juiceDocument($, {
      extraCss: options.extraCss || ''
    })('body').html());
    callback(nodeCache.get(cacheKey));
  } catch (e) {
    callback();
  }
}

function inlineCss($, options, callback) {
  const link = $('link[rel="stylesheet"]').first();
  if (link.attr('href') === undefined) {
    cssCallback($, options, callback);
  } else {
    request({
      uri: link.attr('href'),
    }, (error, response, body) => {
      try {
        cssom.parse(body);
      } catch (e) {
        body = '';
      }
      $('head').append(`<style>${body}</style>`);
      link.remove();
      inlineCss($, options, callback);
    });
  }
}

function domCallback(html, options, callback) {
  const $ = cheerio.load(html);
  $('script').remove();
  if (options.isValidUrl) {
    cleanRelativePathes($, options.data);
  }
  inlineCss($, options, callback);
}

extractor.fetch = (data, options, callback) => {
  let cacheKey = null;
  const isValidUrl = utils.isValidUrl(data);
  if (options instanceof Function) {
    callback = options;
    options = undefined;
  }

  options = cleanOptions(options);
  options.isValidUrl = isValidUrl;

  if (isValidUrl) {
    cacheKey = `${data}#${options.selector}#css${options.inlineCss}#innerText${options.innerText}`;
    const cachedValue = nodeCache.get(cacheKey);
    if (cachedValue && cachedValue[cacheKey] !== undefined) {
      callback(cachedValue[cacheKey]);
      return;
    }
    if (data.indexOf('http') !== 0) {
      data = `http://${data}`;
    }
    options.data = data;
    request({
      uri: data,
    }, (error, response, body) => {
      domCallback(body, options, callback);
    });
  } else {
    domCallback(data, options, callback);
  }
};

extractor.middleware = () =>
  (req, res, next) => {
    const params = url.parse(req.url, true).query;
    if (params.url !== undefined && params.selector !== undefined) {
      params.selector = params.selector.replace('|sharp|', '#');
      if (params.extraCss !== undefined) {
        params.extraCss = params.extraCss.replace('|sharp|', '#');
      }
      extractor.fetch(params.url, {
        selector: params.selector,
        extraCss: params.extraCss,
        removeLinks: params.removeLinks || false
      }, (response) => {
        if (response !== undefined) {
          res.write(response);
        }
        res.end();
      });
    } else {
      next();
    }
  };
