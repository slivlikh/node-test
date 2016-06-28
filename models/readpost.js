// модуль обработки POST запроса
module.exports = function(req, res, callback){
	var body = "";
	req
		.on("readable", function(data){
			var read = req.read();
			if(read){
				body += read;
			}
			if(body.length > 1e4){
				res.statusCode = 413;
				red.end("Вы ввели слишком большой запрос");
			}
		})
		.on("end", function(){
			try{
				if(body){
					body = JSON.parse(body);
				}
			}catch(e){
				return callback(e);
			}
			return callback(undefined, body);
		});
};
