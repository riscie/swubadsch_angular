'use strict';

/*swubadschApp.controller('ChooseUserCtrl', function ($scope, $localStorage, $location, users){
  $http.get('/api/index.php/users').success(function(data) {
    $scope.users = data;
    });*/

//Factory for fetching UserData
swubadschApp.factory('users', function($http){
  function getData(callback){
    $http({
      method: 'GET',
      url: '/api/index.php/users',
      cache: true
    }).success(callback);
  }


   return {
    list: getData
  };
});

//Factory for creating users
swubadschApp.factory('createUser', ['$http', function($http) {
  var urlBase = '/api/index.php/users';
  var dataFactory = {};

  dataFactory.createNewUser = function(username){
    return $http.post(urlBase, {"name": username})
  };

  return dataFactory;

}]);

//ChoseUserCtrl
swubadschApp.controller('ChooseUserCtrl', function ($scope, $localStorage, $location, users, createUser, $window){
  users.list(function(users) {
      $scope.users = users;
  });


  $scope.$storage = $localStorage.$default({
    userid: -1
  });

  if ($localStorage.userid != -1) { $location.path('/opportunities')}


  $scope.createNewUser = function(username){
    //Check if the hidden Input filledByBot is emtpy. If not, just ignore the fkn bot.
    if(!document.getElementById('filledByBot').value){
      createUser.createNewUser(username);
      setTimeout(function(){$window.location.reload(true)}, 500);
    }
  }
});
