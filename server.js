var fw = require('./router/router');
var sendFile = require('./models/sendFile');
var file = require('./models/file.js');
var app = new fw();
app.listen(2000);
app.static('public');
app.use('/')
	.get(function(req, res){
		sendFile('/view/index.html', res);
	});
app.use('/jobwithfiles/create-file')
	.post(function(req, res, body){
		file.create('/public/txt/'+body.fileName+'.txt', function(err){
			if(err){
				res.statusCode = 400;
				res.end("Bad request");
			}
			res.statusCode = 200;
			res.end(JSON.stringify({name: body.fileName+'.txt'}));
		});
	});


app.use('/jobwithfiles/uppdate')
	.post(function(req, res, body){
		file.read('/public/txt/'+body.fileName, res, function(err){
			if(err){
				res.statusCode = 400;
				res.end("Bad request");
			}
		
			file.uppdate('/public/txt/'+body.fileName, body.data, function(err){
				if(err){
					res.statusCode = 400;
					res.end("Bad request");
				}
				res.statusCode = 200;
				res.end();
			});
		});
	});

app.use('/jobwithfiles/getfilesnameindir')
	.post(function(req, res, body){
		file.checkExist('/public/txt', function(exist){
			if(exist){
				file.getfilesnameindir('/public/txt/', function(err, data){
					if(err){
						res.statusCode = 400;
						res.end("Bad request");
					}
					res.statusCode = 200;
					res.end(JSON.stringify(data));
				});
			}else{
				file.createDir('/public/txt', function(err){
					if(err){
						res.statusCode = 400;
						res.end("Bad request");
					}
					res.statusCode = 200;
					res.end();
				});
			}
		});
	});

app.use('/jobwithfiles/remove')
	.post(function(req, res, body){
		file.remove('/public/txt/'+body.fileName,  function(err){
			if(err){
				res.statusCode = 400;
				res.end("Bad request");
			}
			res.statusCode = 200;
			res.end('OK');
		});
	});


app.error(function(req, res, err){
	console.log(err);
	res.statusCode = 400;
	res.end('bad request');
});
