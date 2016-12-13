const domextractor = require('./../src/dom-extractor');

domextractor.fetch("<html><head><style>.b{background-color:#eee}</style></head><body><div class='b'>"
  + "<a href='ok'>ok mec</a></div><div class='c'>ok</div></body></html>",
  '.b',
  (data) => {
    console.log('A:', data);
  });

domextractor.fetch("<html><head><style>.b{background-color:#eee}</style></head><body><div class='b'>"
  + "<a href='ok'>ok mec</a></div><div class='c'>ok</div></body></html>", {
    selector: '.b',
    innerText: true
  }, (b) => {
    console.log('B:', b);
  });

domextractor.fetch("<html><head><style>.b{background-color:#eee}</style></head><body><div class='b'>"
  + "<a href='ok'>ok mec</a></div><div class='c'>ok</div></body></html>", {
    selector: '.b',
    innerText: true,
    inlineCss: false
  }, (c) => {
    console.log('C:', c);
  });

domextractor.fetch("<html><head><style>.b{background-color:#eee}</style></head><body><div class='b'>"
  + "<a href='ok'>ok mec</a></div><div class='c'>ok</div></body></html>", {
    selector: '.b',
    innerText: false,
    inlineCss: false
  }, (d) => {
    console.log('D:', d);
  });

domextractor.fetch("<html><head><style>.b{background-color:#eee}</style></head><body><div class='b'>"
  + "<a href='ok'>ok mec</a></div><div class='c'>ok</div></body></html>", {
    selector: '.b',
    innerText: false,
    inlineCss: false,
    removeLinks: true
  }, (e) => {
    console.log('E:', e);
  });

domextractor.fetch('http://www.camif.fr/espace-service/livraison-gratuite.html', {
  selector: 'div.contentpconseil',
  innerText: false,
  inlineCss: true
}, (f) => {
  console.log('F:', f);
});
