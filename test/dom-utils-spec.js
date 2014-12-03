//test/dom-utils-spec.js
var domutils = require("../src/dom-utils");
 
describe("dom utils URL tools", function () {
  it("should detect a valid URL [no protocol]", function () {
    expect(domutils.isValidUrl("www.google.fr")).toBe(true);
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