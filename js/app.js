angular.module('brastlewarkApp', [, 'ui.bootstrap.modal', 'ui.bootstrap', 'dataGrid', 'pagination'])
    .controller('brastlewarkAppController', ['$scope', 'brastlewarkFactory', '$filter', function ($scope, brastlewarkFactory, $filter) {

        $scope.gridOptions = {
            data: [],
            urlSync: true
        };

        brastlewarkFactory.getData().then(function (responseData) {
           $scope.population=responseData.data.Brastlewark;
           $scope.gridOptions.data = $scope.population;
           $scope.loadFilters();
        });

	    $scope.loadFilters = function() {
	        var _professions=[];
	       
	        $scope.professions=[];
	    
	    	_professions.push('');
	        _.each($scope.population, function(model){
	            _professions.push(model.professions);
	        });

	        $scope.professions.push(_.union(_.flatten(_professions)));   
	    };

        $scope.open = function(_item) {
        	$scope.profile={};
        	$scope.profile=_item;
            $scope.showModal = true;
		};

	  	$scope.ok = function() {
	   	 	$scope.showModal = false;
	  	};

	  	$scope.cancel = function() {
	    	$scope.showModal = false;
	  	};	  	


    }])
    .factory('brastlewarkFactory', function ($http) {
        return {
            getData: function () {
                return $http({
                    method: 'GET',
                    url: 'https://raw.githubusercontent.com/rrafols/mobile_test/master/data.json',
                    cache: true
                });
            }
        }
    });
