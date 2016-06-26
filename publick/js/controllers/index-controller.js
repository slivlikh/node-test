angular.module('nodeTest', []).controller('indexController', ['$scope', '$http', '$timeout', '$interval'
    , '$filter', '$rootScope',
    function (scope, http, timeout, interval, filter, rootScope) {
    	scope.files = [];
    	scope.disabledUppdateFile = true;
    	scope.disabledCreateNewFile = true;
    	var testStatuses = {
    		duplicate: "Файл с таким именем уже существует",
    		chooseFile: "Выберете файл для редактирования",
    		fileNotExist: "Файлы для редактирования отсутствуют",
    		inputData: "Введите данные для отправки",
    		selectFile:  "Выберан файл "
    	}


    	scope.changeTextTofile = function(){
    		if(scope.textTofile == ""){
    			scope.disabledUppdateFile = true;
    		}else{
    			scope.disabledUppdateFile = false;
    		}
    	};



    	http.post('./jobwithfiles/getfilesnameindir').then(
    		function (res){
    			if(res.data.length > 0){
    				var nameFilesArr = JSON.parse(JSON.stringify(res.data));
    				for(var i = 0; nameFilesArr.length > i; i++){
    					scope.files.push({name: nameFilesArr[i]});
    				}
    				scope.status = testStatuses.chooseFile;
    			}else{
    				scope.status = testStatuses.fileNotExist;
    			}
            });





    	scope.createNewFile = function(){
    		for(var i = 0; scope.files.length > i; i++){
    			if(scope.files[i].name == scope.newFileName+'.txt'){
    				scope.status = testStatuses.duplicate; return;
    			} 
    		}
    		var req = {
				 method: 'POST',
				 url: './jobwithfiles/create-file',
				 dataType: "json",
				 headers: {
				   'Content-Type': "application/json"
				 },
				 data: JSON.stringify({'fileName': scope.newFileName})
			}

    		http(req)
    			.then(
    				function(res){
    					console.log(res);
    					if(res.status == 200){
    						scope.files.push(JSON.parse(JSON.stringify({name:res.data.name})));
    						scope.newFileName = "";
    					} 
    				});
			
    	}
    	
    	scope.chengeNewFileName = function(){
    		if(scope.newFileName == ""){
    			scope.disabledCreateNewFile = true;
    		}else{
    			scope.disabledCreateNewFile = false; 
    		}
    	};


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
    			}
    			if(scope.files.length == 0){
    				scope.disabledUppdateFile = true;
    				scope.status = testStatuses.fileNotExist;;
    			}
            });
    	};


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
    			}
    			
            });
    	};


    }]);