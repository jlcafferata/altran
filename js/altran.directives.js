
angular.module('altranModule')
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
});


