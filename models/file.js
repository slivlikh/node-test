// функции для работы с файлами

var fs = require('fs');
var path = require('path');
var sendFile = require('./sendFile.js');
var file = {};
file.create = function(uri, callback){
	var filepath = path.join(process.cwd(), unescape(uri));
	fs.writeFile(filepath, "", function(err, e) {
		if(err) return callback(err);
		return callback(undefined);
	});
};

file.read = function(uri, res, callback){
	sendFile(uri, res, callback)
};
file.uppdate = function(uri, data, callback){
	var filepath = path.join(process.cwd(), unescape(uri));
	fs.appendFile(filepath, data+' \n', function(err) {
		if(err) return callback(err);
		return callback(undefined);
	});
}

file.remove = function(uri, callback){
	var filepath = path.join(process.cwd(), unescape(uri));
	fs.unlink(filepath, function(err){
		if(err) return callback(err);
		return callback(undefined);
	});
};

file.getfilesnameindir = function(uri, callback){
	var filepath = path.join(process.cwd(), unescape(uri));
	fs.readdir(filepath, function(err, data){
  	if (err) callback(err);
  	callback(undefined, data);
	});
}

file.checkExist = function(uri, callback){
	var joinPath = path.join(process.cwd(), unescape(uri));
	fs.exists(joinPath, callback);
}
file.createDir = function(uri, callback){
	var joinPath = path.join(process.cwd(), unescape(uri));
	fs.mkdir(joinPath, callback);
}

module.exports = file;