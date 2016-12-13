const domextractor = require('./../src/dom-extractor');
const assert = require('assert');

domextractor.fetch("<html><head><style>.b{background-color:#eee}</style></head><body><div class='b'>"
  + "<a href='ok'>ok mec</a></div><div class='c'>ok</div></body></html>",
  '.b',
  (data) => {
    assert.notEqual(data, undefined);
  });

domextractor.fetch("<html><head><style>.b{background-color:#eee}</style></head><body><div class='b'>"
  + "<a href='ok'>ok mec</a></div><div class='c'>ok</div></body></html>", {
    selector: '.b',
    innerText: true
  }, (b) => {
    assert.notEqual(b, undefined);
  });

domextractor.fetch("<html><head><style>.b{background-color:#eee}</style></head><body><div class='b'>"
  + "<a href='ok'>ok mec</a></div><div class='c'>ok</div></body></html>", {
    selector: '.b',
    innerText: true,
    inlineCss: false
  }, (c) => {
    assert.notEqual(c, undefined);
  });

domextractor.fetch("<html><head><style>.b{background-color:#eee}</style></head><body><div class='b'>"
  + "<a href='ok'>ok mec</a></div><div class='c'>ok</div></body></html>", {
    selector: '.b',
    innerText: false,
    inlineCss: false
  }, (d) => {
    assert.notEqual(d, undefined);
  });

domextractor.fetch("<html><head><style>.b{background-color:#eee}</style></head><body><div class='b'>"
  + "<a href='ok'>ok mec</a></div><div class='c'>ok</div></body></html>", {
    selector: '.b',
    innerText: false,
    inlineCss: false,
    removeLinks: true
  }, (e) => {
    assert.notEqual(e, undefined);
  });

domextractor.fetch('http://www.camif.fr/espace-service/livraison-gratuite.html', {
  selector: 'div.contentpconseil',
  innerText: false,
  inlineCss: true
}, (f) => {
  assert.notEqual(f, undefined);
});
