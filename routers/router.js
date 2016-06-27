// главный роутер

var sendFile = require('../models/sendFile.js');
var path = require('path');
var jobwithfiles = require('./jobwithfiles.js');
var url = require('url');
module.exports = function(req, res){
	var uri = url.parse(req.url).pathname;
	var uriArr = uri.split('/');
	if(uri === '/'){
		sendFile('./view/index.html', res);
	}else{
		switch(uriArr[1]){
			case 'public' : sendFile(uri, res); break;
			case 'jobwithfiles' : jobwithfiles(req, res, uriArr); break;
			default: res.writeHead(404, {'Content-type': 'text/html'}); res.end('<h1>Not Found</h1>');
		}
	}
};