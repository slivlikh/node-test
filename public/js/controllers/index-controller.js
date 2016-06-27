angular.module('nodeTest', []).controller('indexController', ['$scope', '$http', '$timeout', '$interval'
    , '$filter', '$rootScope',
    function (scope, http, timeout, interval, filter, rootScope) {
    	scope.files = []; // массив объектов со свойствами файла
    	scope.disabledUppdateFile = true; // блокировка кнопки отправки обновления файла
    	scope.disabledCreateNewFile = true; // блокировка кнопки создания нового файла
        scope.textTofile = "";
        scope.newFileName = "";
        var selectedFile = undefined;
    	var testStatuses = { // статусы 
    		duplicate: "Файл с таким именем уже существует",
    		chooseFile: "Выберете файл для редактирования",
            createdFile: "Файл успешно создан",
    		fileNotExist: "Файлы для редактирования отсутствуют",
    		inputData: "Введите данные для отправки",
    		selectFile:  "Выбран файл ",
    		error: "Произошла ошибка"
    	}

        // вызываеться при изменении в textarea
        scope.checkdisabledUpdateFile = function(){
            if(selectedFile && scope.textTofile.trim() !== ""){
                scope.disabledUppdateFile = false;
            }else{
                scope.disabledUppdateFile = true;
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
                            scope.status = testStatuses.createdFile;
    					}else{
    						scope.status = testStatuses.error;
    					}
    				}, error);
			
    	}
    	
    	// срабатывает при изменении в поле ввода имени нового файла
    	scope.changeNewFileName = function(){
    		if(scope.newFileName.trim() == ""){
    			scope.disabledCreateNewFile = true;
    		}else{
    			scope.disabledCreateNewFile = false; 
    		}
    	};

    	// срабатывает при выборе файла
        scope.chooseFile = function(file){
            if(selectedFile){
                if(file.selected){
                    file.selected = false;
                    selectedFile = undefined;
                    scope.status = testStatuses.chooseFile;
                }else{
                    selectedFile.selected = false;
                    selectedFile = file;
                    selectedFile.selected = true;
                    scope.status = testStatuses.selectFile + file.name;
                }
            }else{
                selectedFile = file;
                selectedFile.selected = true;
                scope.status = testStatuses.selectFile + file.name;
            }

            scope.checkdisabledUpdateFile();
    	}


    	// удаление файла
    	scope.removeFile = function(file){
    		http.post('./jobwithfiles/remove', {'fileName': file.name}).then(
    		function (res){
    			if(res.status == 200){
    				if(file.selected){
                        selectedFile = undefined;
    					scope.status = testStatuses.chooseFile;
    				}
                    for(var i = 0; scope.files.length > i; i++){
                        if(scope.files[i] == file){
                            scope.files.splice(i, 1);
                            break;
                        }
                    }
                    scope.checkdisabledUpdateFile();
    			}else{
    				scope.status = testStatuses.error;
    			}
    			if(scope.files.length == 0){
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