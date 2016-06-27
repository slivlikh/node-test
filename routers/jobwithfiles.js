// роутер для работы с файлами

var fs = require('fs');
var path = require('path');
var readPost = require('../models/readpost.js')
var file = require('../models/file.js');


module.exports = function(req, res, uriArr){
	if(!uriArr[2]){
		res.statusCode = 404;
	}
	readPost(req, res, function(err, body){
		if(err){
			res.statusCode = 400;
			res.end("Bad request");
		} 
		switch(uriArr[2]){
			case 'create-file': file.create( './public/txt/'+body.fileName+'.txt', function(err){
				if(err){
					res.statusCode = 400;
					res.end("Bad request");
				}
				res.statusCode = 200;
				res.end(JSON.stringify({name: body.fileName+'.txt'}));
			}); break; 

			case "uppdate": file.read('./public/txt/'+body.fileName, res, function(err, data){
				if(err){
					res.statusCode = 400;
					res.end("Bad request");
				}
				file.uppdate('./public/txt/'+body.fileName, body.data, function(err){
					if(err){
						res.statusCode = 400;
						res.end("Bad request");
					}
				});
				res.statusCode = 200;
				res.end(data);
			} ); break;

			case "getfilesnameindir": file.getfilesnameindir('/public/txt/', function(err, data){
				if(err){
					res.statusCode = 400;
					res.end("Bad request");
				}
				res.statusCode = 200;
				res.end(JSON.stringify(data));
			}); break;

			case "remove": file.remove('./public/txt/'+body.fileName,  function(err){
				if(err){
					res.statusCode = 400;
					res.end("Bad request");
				}
				res.statusCode = 200;
				res.end('OK');
			} ); break;

			default: res.writeHead(404, {'Content-type': 'text/html'}); res.end('Not Found');
		}
	});
};