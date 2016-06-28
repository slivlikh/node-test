var http = require('http');
var url = require('url');
var readPost = require('../models/readpost');
var sendFile = require('../models/sendFile');
var methodRequest = {};
methodRequest.GET = {};
methodRequest.POST = {};

module.exports = fw;
function fw(){
	var _this = this;
	this._server = http.createServer(function(req, res){
		if(req.method != "GET" && req.method != "POST"){
			res.statusCode = 400;
			res.statusMessage = 'Bad request';
			res.end('bad request');
			console.log('400');
			return;
		}
		var pathName = url.parse(req.url, true).pathname;
		if(pathName.split('/')[1] == _this.nameDir){
			sendFile(pathName, res, function(err){
				if(err) _this.error(req, res, err);
			});
			return;
		}
		if(req.method == "GET" && pathName in methodRequest.GET){
			methodRequest.GET[pathName](req, res);
		}else if(req.method == "POST" && pathName in methodRequest.POST){
			readPost(req, res, function(err, body){
				if(err) _this.error(req, res, err);
				methodRequest.POST[pathName](req, res, body);
			});			
		}else{
			res.statusCode = 404;
			res.statusMessage = 'Not found';
			res.end('not found');
			console.log('404');
		}
	});
};

fw.prototype.use = function(url){
	if(typeof url != 'string' ) throw new Error('url must be string');
	this.currUse = url;
	return this;
};


fw.prototype.get = function(func){
	methodRequest.GET[this.currUse] = func;
	return this;
};
fw.prototype.post = function(func){
	methodRequest.POST[this.currUse] = func;
	return this;
};
fw.prototype.listen = function(port){
	if(typeof port != "number") throw new Error('port must be number');
	this._server.listen(port, function(){
		console.log('server listen on ' + port + ' port');
	});
};
fw.prototype.error = function(func){
	this.error = func;
};
fw.prototype.static = function(nameDir){
	this.nameDir = nameDir;
};
