'use strict';

/*app.controller('ChooseUserCtrl', function ($scope, $localStorage, $location, users){
  $http.get('/api/index.php/users').success(function(data) {
    $scope.users = data;
    });*/

//Factory for fetching UserData
/*
 app.factory('users', function($http){
  function getData(callback){
    $http({
      method: 'GET',
      url: '/api/index.php/users',
      cache: false
    }).success(callback);
  }


   return {
    list: getData
  };
});
*/


app.factory('users', ['$http', function($http) {
  var urlBase = '/api/index.php/users';
  var dataFactory = {};

  dataFactory.getUsers = function () {
    return $http.get(urlBase);
  }

  dataFactory.createNewUser = function(username){
    return $http.post(urlBase, {"name": username})
  };

  return dataFactory;
}]);


//Factory for creating users
app.factory('createUser', ['$http', function($http) {
  var urlBase = '/api/index.php/users';
  var dataFactory = {};

  dataFactory.createNewUser = function(username){
    return $http.post(urlBase, {"name": username})
  };

  dataFactory.getUsers = function () {
    return $http.get(urlBase);
  }

  return dataFactory;

}]);

//ChoseUserCtrl
app.controller('ChooseUserCtrl', function ($scope, $localStorage, $location, users, createUser, $window, $timeout) {



   users.list(function (users) {
     $timeout(function() {
       $scope.users = users;
       $scope.$apply()
     }, 1000);
  });








  $scope.$storage = $localStorage.$default({
    userid: -1
  });

  if ($localStorage.userid != -1) { $location.path('/opportunities')}


  $scope.createNewUser = function(username){
    //Check if the hidden Input filledByBot is emtpy. If not, just ignore the fkn bot.
    if(!document.getElementById('filledByBot').value){

      createUser.createNewUser(username);

    //  setTimeout(function(){$scope.loadUsers();}, 5000);
   //   setTimeout(function(){$window.location.reload(true)}, 500);
    }
  }
});
