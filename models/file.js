// функции для работы с файлами

var fs = require('fs');
var path = require('path');
var sendFile = require('./sendFile.js');
var file = {};
file.create = function(path, callback){
	fs.writeFile(path, "", function(err, e) {
		if(err) return callback(err);
		return callback(undefined);
	});
};

file.read = function(path, res, callback){
	sendFile(path, res, callback)
};
file.uppdate = function(path, data, callback){
	fs.appendFile(path, data+' \n', function(err) {
		if(err) return callback(err);
		return callback(undefined);
	});
}

file.remove = function(path, callback){
	fs.unlink(path, function(err){
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

module.exports = file;