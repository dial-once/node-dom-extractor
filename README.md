node-dom-extractor
==================
[![Build Status](https://travis-ci.org/dial-once/node-dom-extractor.svg?branch=master)](https://travis-ci.org/dial-once/node-dom-extractor)
[![Code Climate](https://codeclimate.com/github/dial-once/node-dom-extractor/badges/gpa.svg)](https://codeclimate.com/github/dial-once/node-dom-extractor)

A node package used to extract a DOM element from a remote page or a string, using selectors. Based on jsdom for fetching and parsing, and juice for inlining css.

## Install

    npm install dom-extractor

## Extract DOM from a remote URL

```js
var extractor = require('dom-extractor');
extractor.fetch("http://github.com/", "div.header", function(data){
	//data contains the extracted HTML with css inlined, here the github header
});
```

## Extract DOM from a string
```js
var extractor = require('dom-extractor');
extractor.fetch("<div class='a'>Hello</div><div class='b'>World</div>!", ".a", function(data){
	//should contains the div with class a
});
```

## Running tests

```sh
npm install
npm install -g jshint
npm test
```
