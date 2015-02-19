//test/dom-utils-spec.js
var domutils = require("../src/dom-utils");
 
describe("dom utils URL validation", function () {
  it("should handle bad parameter [no param]", function () {
    expect(domutils.isValidUrl()).toBe(false);
  });
  it("should handle bad parameter [null param]", function () {
    expect(domutils.isValidUrl(null)).toBe(false);
  });
  it("should handle bad parameter [function param]", function () {
    expect(domutils.isValidUrl(function(){})).toBe(false);
  });
  it("should detect a valid URL [no protocol]", function () {
    expect(domutils.isValidUrl("www.google.fr")).toBe(true);
  });
  it("should detect a valid URL [short TLD]", function () {
    expect(domutils.isValidUrl("google.fr")).toBe(true);
  });
  it("should detect a valid URL [long TLD]", function () {
    expect(domutils.isValidUrl("www.a.site.1.google.fr")).toBe(true);
  });
  it("should detect a valid URL [http]", function () {
    expect(domutils.isValidUrl("http://www.google.fr")).toBe(true);
  });
  it("should detect a valid URL [https]", function () {
    expect(domutils.isValidUrl("https://www.google.fr")).toBe(true);
  });
  it("should detect a valid URL [path]", function () {
    expect(domutils.isValidUrl("https://www.google.fr/ping/pong")).toBe(true);
  });
  it("should detect a valid URL [parameters]", function () {
    expect(domutils.isValidUrl("https://www.google.fr/thing/?value=ok")).toBe(true);
  });
  it("should detect an invalid URL [protocol malformed]", function () {
    expect(domutils.isValidUrl("htt:/toto.fr")).toBe(false);
  });
  it("should detect an invalid URL [protocol unknow]", function () {
    expect(domutils.isValidUrl("toto://toto.fr")).toBe(false);
  });
  it("should detect an invalid URL [bad ending]", function () {
    expect(domutils.isValidUrl("http://toto.f")).toBe(false);
  });
});

describe("dom utils URL relative to absolute", function () {
  it("should return correct absolute URL [absolute URL]", function () {
    expect(domutils.relToAbs('https://github.com', 'https://github.com')).toBe('https://github.com/');
  });
  it("should return correct absolute URL [relative URL]", function () {
    expect(domutils.relToAbs('https://github.com', '/dial-once')).toBe('https://github.com/dial-once');
  });
  it("should return correct absolute URL [relative URL ..]", function () {
    expect(domutils.relToAbs('https://github.com/a/', '../dial-once')).toBe('https://github.com/dial-once');
  });
  it("should return correct absolute URL [complex URL]", function () {
    expect(domutils.relToAbs('https://github.com/a/?param=toto', '/dial-once.css')).toBe('https://github.com/dial-once.css');
  });
  it("should return correct absolute URL [complex URL]", function () {
    expect(domutils.relToAbs('https://github.com/a/?param=toto', '/dial-once.css')).toBe('https://github.com/dial-once.css');
  });
  it("should return correct absolute URL [URL on another domain]", function () {
    expect(domutils.relToAbs('https://github.com/a/?param=toto', 'http://bitbucket.com/dial-once.css')).toBe('http://bitbucket.com/dial-once.css');
  });
  it("should return correct absolute URL [absolute url without protocol]", function () {
    expect(domutils.relToAbs('https://github.com/a/?param=toto', '//dial-once.css')).toBe('//dial-once.css');
  });
});