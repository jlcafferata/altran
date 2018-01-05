
angular.module('altranModule')
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
}]);


