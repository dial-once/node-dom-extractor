var domextractor = require('..');
//full text
domextractor.fetch("<html><head><style>.b{background-color:#eee}</style></head><body><div class='b'><a href='ok'>ok mec</a></div><div class='c'>ok</div></body></html>", '.b', function(data){
	console.log(data);
});

//github header
domextractor.fetch("https://github.com/", 'div.header', function(data){
	//value should be cached
	domextractor.fetch("https://github.com/", 'div.header', function(data){
		console.log(data);
	});
});

