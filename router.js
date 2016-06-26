var sendFile = require('./models/sendFile.js');
var path = require('path');
var jobwithfiles = require('./models/jobwithfiles.js');
var url = require('url');
module.exports = function(req, res){
	var uri = url.parse(req.url).pathname;
	var uriArr = uri.split('/');
	if(uri === '/'){
		sendFile('./view/index.html', res);
	}else{
		switch(uriArr[1]){
			case 'publick' : sendFile(uri, res); break;
			case 'jobwithfiles' : jobwithfiles(req, res, uriArr); break;
		}
	}
};