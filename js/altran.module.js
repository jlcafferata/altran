
angular.module('altranModule', [])
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


