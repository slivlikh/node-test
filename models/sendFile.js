// зачитывание от отаравка страники
var path = require('path');
var fs = require('fs');
var mimeTypes = {
	"html": "text/html",
	"jpeg": "image/jpeg",
	"jpg": "image/jpeg",
	"png": "image/png",
	"js": "text/javascript",
	"css": "text/css",
	'txt': "text/plain"
};
module.exports = function(uri, res, callback){
	var filename = path.join(process.cwd(), unescape(uri));
		var stats;
		 fs.lstat(filename, function(err, stats){
		 	if(err){
		 		res.writeHead(404, {'Content-type': 'text/html'});
				res.write('<h1>404 Not Found</h1>');
				res.end();
				return;
		 	}
		 	if(stats.isFile()){
		 		var expansion = path.extname(filename).split('.').reverse()[0];
				var mimeType = (expansion in mimeTypes) ? mimeTypes[expansion]:"text/plain";
				var fileStream = new fs.ReadStream(filename);
				res.writeHead(200, {'Content-type': mimeType});
				fileStream.pipe(res);
				fileStream.on('error', function(err){
					if(typeof callback == 'function'){
						callback(err);
					}
					res.writeHead(500, {'Content-type': 'text/html'});
					res.write('500 Interval Error\n');
					res.end();
				});
				fileStream.on('end', function(){
					if(typeof callback == 'function'){
						callback();
					}
				});
				res.on('close', function(){
					fileStream.destroy();
				});
			}else if(stats.isDirectory()){
				res.writeHead(403, {'Content-type': 'text/html'});
				res.end('<h1>Forbidden</h1>');
			}else{
				res.writeHead(500, {'Content-type': 'text/html'});
				res.write('500 Interval Error\n');
				res.end();
			}

		 });
}
