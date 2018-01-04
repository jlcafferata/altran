
angular.module('altranModule', [])
.controller('altranController', ['$scope', 'altranFactory', '$cacheFactory', '$locale', function($scope, altranFactory, $cacheFactory, $locale) {

 	$scope.keys = [];
  $scope.cache = $cacheFactory('altranCache');
  	
	$scope.put = function(key) {
	    if (angular.isUndefined($scope.cache.get(key))) {
	   		$scope.keys.push(key);
	   		altranFactory.getData().then(function (responseData) {
	        	$scope.population=responseData.data.Brastlewark;       
	        	$scope.cache.put(key, angular.isUndefined($scope.population) ? null : $scope.population);	
	        	$scope.loadFilters();	        	
	    	});	   
	   	} else{
			$scope.population=$scope.cache.get(key);
			$scope.loadFilters();
		}
  	};
	
    $scope.loadFilters = function() {
	        var _professions=[];
	       
	        $scope.professions=[];
	    
	    	_professions.push('');
	        _.each($scope.population, function(model){
	            _professions.push(model.professions);
	        });

	        $scope.professions.push(_.union(_.flatten(_professions)));   
    };
   
    $scope.put('altranCache');
}])
.directive('myCard', function() {
  return {
  	scope: {
       people: '='
	   },
	   templateUrl: 'templates/card.html'
  };
})
.directive('myFilters', function() {
  return {
  	templateUrl: 'templates/filters.html'
  };
})
.filter('numberEx', ['numberFilter', '$locale',
  function(number, $locale) {

    var formats = $locale.NUMBER_FORMATS;
    return function(input, fractionSize) {
      //Get formatted value
      var formattedValue = number(input, fractionSize);

      //get the decimalSepPosition
      var decimalIdx = formattedValue.indexOf(formats.DECIMAL_SEP);

      //If no decimal just return
      if (decimalIdx == -1) return formattedValue;


      var whole = formattedValue.substring(0, decimalIdx);
      var decimal = (Number(formattedValue.substring(decimalIdx)) || "").toString();

      return whole +  decimal.substring(1);
    };
  }
])
.factory('altranFactory', function ($http) {
    return {
        getData: function () {
        	return $http({
                method: 'GET',
                //url: 	'https://raw.githubusercontent.com/rrafols/mobile_test/master/data.json',
                url: 	'json/data.json',
                cache: true
            });
        }
    }
});


