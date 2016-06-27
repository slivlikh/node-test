angular.module('nodeTest', []).controller('indexController', ['$scope', '$http', '$timeout', '$interval'
    , '$filter', '$rootScope',
    function (scope, http, timeout, interval, filter, rootScope) {
    	scope.files = []; // массив объектов со свойствами файла
    	scope.disabledUppdateFile = true; // блокировка кнопки отправки обновления файла
    	scope.disabledCreateNewFile = true; // блокировка кнопки создания нового файла
    	var testStatuses = { // статусы 
    		duplicate: "Файл с таким именем уже существует",
    		chooseFile: "Выберете файл для редактирования",
    		fileNotExist: "Файлы для редактирования отсутствуют",
    		inputData: "Введите данные для отправки",
    		selectFile:  "Выберан файл ",
    		error: "Произошла ошибка"
    	}

    	// вызываеться при изменении в textarea
    	scope.changeTextTofile = function(){ 
    		if(scope.textTofile == ""){
    			scope.disabledUppdateFile = true;
    		}else{
    			scope.disabledUppdateFile = false;
    		}
    	};

    	// проверяет наличие ренее созданых файлов и выводит их название
    	http.post('./jobwithfiles/getfilesnameindir').then(
    		function (res){
    			if(res.status == 200){
    				if(res.data.length > 0){
    					var nameFilesArr = JSON.parse(JSON.stringify(res.data));
    					for(var i = 0; nameFilesArr.length > i; i++){
    						scope.files.push({name: nameFilesArr[i]});
    					}
    					scope.status = testStatuses.chooseFile;
    				}else{
    					scope.status = testStatuses.fileNotExist;
    				}
    			}else{
    				scope.status = testStatuses.error;
    			}
            }, error);

    	// создание нового файла
    	scope.createNewFile = function(){
    		for(var i = 0; scope.files.length > i; i++){
    			if(scope.files[i].name == scope.newFileName+'.txt'){
    				scope.status = testStatuses.duplicate; return;
    			} 
    		}

    		http.post('./jobwithfiles/create-file', JSON.stringify({'fileName': scope.newFileName}) )
    			.then(
    				function(res){
    					if(res.status == 200){
    						scope.files.push(JSON.parse(JSON.stringify({name:res.data.name})));
    						scope.newFileName = "";
    					}else{
    						scope.status = testStatuses.error;
    					}
    				}, error);
			
    	}
    	
    	// срабатывает при изменении в поле ввода имени нового файла
    	scope.chengeNewFileName = function(){
    		if(scope.newFileName == ""){
    			scope.disabledCreateNewFile = true;
    		}else{
    			scope.disabledCreateNewFile = false; 
    		}
    	};

    	// срабатывает при выборе файла
    	scope.chooseFile = function(file){
    		if(file.selected){
    			file.selected = false;
    			scope.status = testStatuses.chooseFile;
    			scope.disabledUppdateFile = true;
    		}else{
    			for(var i = 0; scope.files.length > i; i++){
    				scope.files[i].selected = false;
    			}
    			scope.status = testStatuses.selectFile+file.name;
    			file.selected = true;
    			scope.disabledUppdateFile = false;
    		}
    	}




    	// удаление файла
    	scope.removeFile = function($index){
    		for(var i = 0; scope.files.length > i; i++){
    			if(scope.files[i].selected) break;
    		}
    		http.post('./jobwithfiles/remove', {'fileName': scope.files[$index].name}).then(
    		function (res){
    			if(res.status == 200){
    				if(scope.files[$index].selected){
    					scope.disabledUppdateFile = true;
    					scope.status = testStatuses.chooseFile;
    				}
    				scope.files.splice($index, 1);
    			}else{
    				scope.status = testStatuses.error;
    			}
    			if(scope.files.length == 0){
    				scope.disabledUppdateFile = true;
    				scope.status = testStatuses.fileNotExist;;
    			}
            }, error);
    	};

    	// отсылает на сервер введеный текст и возвращает содержимое файла
    	scope.uppdateFile = function(){
    		var hawSelected = false;
    			for(var i = 0; scope.files.length > i; i++){
    				if(scope.files[i].selected){
    					hawSelected = true;
    					break;
    				}
    			}
    			if(!hawSelected){
    				scope.status = testStatuses.chooseFile;
    				return;
    			}
    			if(!scope.textTofile){
    				scope.status = testStatuses.inputData;
    				return;
    			}
    			    		
    		http.post('./jobwithfiles/uppdate', {'fileName': scope.files[i].name, data: scope.textTofile}).then(
    		function (res){
    			if(res.status == 200){
    				console.log(res);
    				scope.fileContent = res.data;
    			}else{
    				scope.status = testStatuses.error;
    			}
    			
            }, error);
    	};

    	function error(){
    		scope.status = testStatuses.error;
    	}


    }]);