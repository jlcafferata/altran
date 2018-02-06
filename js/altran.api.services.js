
angular.module('apiConsumer')
.service('userService', function($http){ 
    return {
       findUsers: function(filterBy, filterValue, callback){
        $http
        .get('http://127.0.0.1:3000/private/users/'+filterBy+'/'+filterValue)
        .then(function(data){
          callback(data);
         })
        .catch(function(data){
          callback(data)
        });
      },

      findUserPolicies: function(filterBy, filterValue, callback){
        $http
        .get('http://127.0.0.1:3000/private/policies/'+filterBy+'/'+filterValue)
        .then(function(data){
          callback(data);
         })
        .catch(function(data){
          callback(data)
        });
      }
    };
    
  }
);