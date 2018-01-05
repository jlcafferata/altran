
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
          
         $scope.highLevelOfQualification=_.max($scope.population, function(people){ return people.professions.length;});
         $scope.highLevelOfPopularity=_.max($scope.population, function(people){ return people.friends.length;});

          _.each($scope.population, function(model){
            model.popularity_score=Math.round((parseFloat(_.isUndefined(model.friends)?0:model.friends.length)/parseFloat($scope.highLevelOfPopularity.friends.length)) * 100);
            model.qualification_score=Math.round((parseFloat(_.isUndefined(model.professions)?0:model.professions.length)/parseFloat($scope.highLevelOfQualification.professions.length)) * 100);
             _professions.push(model.professions);
          });

           $scope.professions.push(_.sortBy(
                _.union(
                    _.flatten(_professions)
                )
              ), 
              function(texto){return texto;}
           );   
         
	    	 
    };
   
    $scope.put('altranCache');
}])
.directive('card', function() {
  return {
  	scope: {
       people: '='
	   },
	   templateUrl: 'templates/card.html'
  };
})
.directive('filters', function() {
  return {
  	templateUrl: 'templates/filters.html'
  };
})
.filter('numberEx', ['numberFilter', '$locale',
  function(number, $locale) {

    var formats = $locale.NUMBER_FORMATS;
    return function(input, fractionSize) {
      var formattedValue = number(input, fractionSize);

      var decimalIdx = formattedValue.indexOf(formats.DECIMAL_SEP);

      if (decimalIdx == -1) return formattedValue;

      var whole = formattedValue.substring(0, decimalIdx);
      var decimal = (Number(formattedValue.substring(decimalIdx)) || "").toString();

      return whole +  decimal.substring(1);
    };
  }
])
.filter('scoring', function(){
    return function(number){
      if(number==0) return 'btn btn-danger fa fa-thumbs-o-down';
      if(number>0 && number<=25) return 'btn fa fa-thumbs-o-down';
      if(number>25 && number <=50) return 'btn fa fa-thumbs-o-up';
      else return 'btn btn-success fa fa-thumbs-o-up';
    }
})
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


