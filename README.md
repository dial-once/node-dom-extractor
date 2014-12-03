node-dom-extractor
==================
[![Build Status](https://travis-ci.org/dial-once/node-dom-extractor.svg?branch=master)](https://travis-ci.org/dial-once/node-dom-extractor)
[![Codacy Badge](https://img.shields.io/codacy/3e4f92342e704e48a14f24b235c94935.svg)](https://www.codacy.com/public/dialonce/node-dom-extractor)

A node package used to extract a DOM element from a remote page or a string, using selectors. Based on jsdom for fetching and parsing, and juice for inlining css.

### Install

    npm install dom-extractor

### Extract DOM from a remote URL
```js
var extractor = require('dom-extractor');
extractor.fetch("http://github.com/", "div.header", function(data){
	//data contains the extracted HTML with css inlined, here the github header
});
```

### Extract DOM from a string
```js
var extractor = require('dom-extractor');
extractor.fetch("<div class='a'>Hello</div><div class='b'>World</div>!", ".a", function(data){
	//should contains the div with class a
});
```

### Use it as a middleware (Connect)
```js
app.use('/proxy', extractor.middleware());
```

### Running tests
```
npm install
npm install -g jshint
npm test
```
