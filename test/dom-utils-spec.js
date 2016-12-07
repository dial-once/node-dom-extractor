// test/dom-utils-spec.js
const domutils = require('../src/dom-utils');
const assert = require('assert');

describe('dom utils URL validation', () => {
  it('should handle bad parameter [no param]', () => {
    assert.equal(domutils.isValidUrl(), false);
  });
  it('should handle bad parameter [null param]', () => {
    assert.equal(domutils.isValidUrl(null), false);
  });
  it('should handle bad parameter [function param]', () => {
    assert.equal(domutils.isValidUrl(() => {}), false);
  });
  it('should detect a valid URL [no protocol]', () => {
    assert.equal(domutils.isValidUrl('www.google.fr'), true);
  });
  it('should detect a valid URL [short TLD]', () => {
    assert.equal(domutils.isValidUrl('google.fr'), true);
  });
  it('should detect a valid URL [long TLD]', () => {
    assert.equal(domutils.isValidUrl('www.a.site.1.google.fr'), true);
  });
  it('should detect a valid URL [http]', () => {
    assert.equal(domutils.isValidUrl('http://www.google.fr'), true);
  });
  it('should detect a valid URL [https]', () => {
    assert.equal(domutils.isValidUrl('https://www.google.fr'), true);
  });
  it('should detect a valid URL [path]', () => {
    assert.equal(domutils.isValidUrl('https://www.google.fr/ping/pong'), true);
  });
  it('should detect a valid URL [parameters]', () => {
    assert.equal(domutils.isValidUrl('https://www.google.fr/thing/?value=ok'), true);
  });
  it('should detect an invalid URL [protocol malformed]', () => {
    assert.equal(domutils.isValidUrl('htt:/toto.fr'), false);
  });
  it('should detect an invalid URL [protocol unknow]', () => {
    assert.equal(domutils.isValidUrl('toto://toto.fr'), false);
  });
  it('should detect an invalid URL [bad ending]', () => {
    assert.equal(domutils.isValidUrl('http://toto.f'), false);
  });
});

describe('dom utils URL relative to absolute', () => {
  it('should return correct absolute URL [absolute URL]', () => {
    assert.equal(domutils.relToAbs('https://github.com', 'https://github.com'), 'https://github.com/');
  });
  it('should return correct absolute URL [relative URL]', () => {
    assert.equal(domutils.relToAbs('https://github.com', '/dial-once'), 'https://github.com/dial-once');
  });
  it('should return correct absolute URL [relative URL ..]', () => {
    assert.equal(domutils.relToAbs('https://github.com/a/', '../dial-once'), 'https://github.com/dial-once');
  });
  it('should return correct absolute URL [complex URL]', () => {
    assert.equal(domutils.relToAbs('https://github.com/a/?param=toto', '/dial-once.css'), 'https://github.com/dial-once.css');
  });
  it('should return correct absolute URL [complex URL]', () => {
    assert.equal(domutils.relToAbs('https://github.com/a/?param=toto', '/dial-once.css'), 'https://github.com/dial-once.css');
  });
  it('should return correct absolute URL [URL on another domain]', () => {
    assert.equal(domutils.relToAbs('https://github.com/a/?param=toto', 'http://bitbucket.com/dial-once.css'), 'http://bitbucket.com/dial-once.css');
  });
  it('should return correct absolute URL [absolute url without protocol]', () => {
    assert.equal(domutils.relToAbs('https://github.com/a/?param=toto', '//dial-once.css'), '//dial-once.css');
  });
});
