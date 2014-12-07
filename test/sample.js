var domextractor = require('..');

domextractor.fetch("<html><head><style>.b{background-color:#eee}</style></head><body><div class='b'><a href='ok'>ok mec</a></div><div class='c'>ok</div></body></html>",
	'.b',
	function(data) {
		console.log('A:', data);
	});

domextractor.fetch("<html><head><style>.b{background-color:#eee}</style></head><body><div class='b'><a href='ok'>ok mec</a></div><div class='c'>ok</div></body></html>", {
	selector: '.b',
	innerText: true
}, function(b) {
	console.log('B:', b);
});

domextractor.fetch("<html><head><style>.b{background-color:#eee}</style></head><body><div class='b'><a href='ok'>ok mec</a></div><div class='c'>ok</div></body></html>", {
	selector: '.b',
	innerText: true,
	inlineCss: false
}, function(c) {
	console.log('C:', c);
});

domextractor.fetch("<html><head><style>.b{background-color:#eee}</style></head><body><div class='b'><a href='ok'>ok mec</a></div><div class='c'>ok</div></body></html>", {
	selector: '.b',
	innerText: false,
	inlineCss: false
}, function(d) {
	console.log('D:', d);
});