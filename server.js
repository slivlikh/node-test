var http = require('http');
var router  = require('./router');


var server = http.createServer(function(req, res){
	router(req, res);
});
server.listen(2000, function(){
	console.log('server listen on 2000 port');
});