
angular.module('apiConsumer')
.controller('apiConsumerController', ['$scope', '$http', 'userService',
  function($scope, $http, userService){
    $scope.filterUser = function(){
      $scope.isNeedToLogin=false;
      $scope.policies={};
      $scope.users={};
      $scope.message=''; 
      userService.findUsers($scope.filterBy, $scope.filterValue, 
        function(res){
           if(res.status=='403'){
            $scope.isNeedToLogin=true;
            $scope.message=(res.data.message || '');
           }else{
            $scope.users=res.data.users; 
            $scope.message=(res.data.message || '');
           }           
        }
      );
    };

    $scope.filterPolicies = function(){
      $scope.isNeedToLogin=false;
      $scope.policies={};
      $scope.users={};
      $scope.message='';      
      userService.findUserPolicies($scope.filterBy, $scope.filterValue, 
        function(res){
           if(res.status=='403'){
            $scope.isNeedToLogin=true;
            $scope.message=(res.data.message || '');
           }else{
            $scope.policies=res.data.policies; 
            $scope.message=(res.data.message || '');
           }           
        }
      );
    };

    $scope.login = function(callback){
      $scope.isNeedToLogin=true;
      $scope.policies={};
      $scope.users={};
      $scope.message='';
      $http({
      method: 'POST',
      url: 'http://127.0.0.1:3000/login',
      data: $.param({
          userName: $scope.userName,
          email: $scope.email
      }),
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      })
      .then(function(response) {
            if(!response.data.token) {
              $http.defaults.headers.common.Authorization='';
              $scope.message=(response.data.message || '');
            }  else {
              $scope.isNeedToLogin=false;
              $http.defaults.headers.common.Authorization = 'Bearer ' + response.data.token;
            } 
      }, 
      function(response) { 
            $http.defaults.headers.common.Authorization='';
            $scope.message=(response.data.message || '');
      });     
    };

}]);



