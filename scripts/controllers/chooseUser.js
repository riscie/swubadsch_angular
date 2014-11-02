'use strict';

//ChoseUserCtrl
app.controller('ChooseUserCtrl', function ($scope, $localStorage, $location, $http) {

  //Defining the API-urlbase for the ChooseUserCtrl
  var urlBase = '/api/index.php/users';

  // Defining the function to fetch all users
  $scope.loadUsers = function () {
  $http.get(urlBase)
      .success(function (data) {
        $scope.users = data;
      });
  };

  $scope.loadUsers(); //when landing on the page, get all users

  //When submitting the Username form, send the new user to the API
  $scope.submitNewUser = function(username) {
    $http.post(urlBase, {"name": username})
        .success(function (data) {
          $scope.username = ""; // clear the form after submit
          $scope.loadUsers(); //Refetch all users
        })
  };

  //Default localStorage is -1. (No User Selected)
  $scope.$storage = $localStorage.$default({
    userid: -1
  });

  //If a user revisits the site and the localStorage is already set, reroute to /opportunities
  if ($localStorage.userid != -1) { $location.path('/opportunities')}



  $scope.createNewUser = function(username){
    //Check if the hidden Input filledByBot is emtpy. If not, just ignore the fkn bot. (Add a CAPTCHA later...)
    if(!document.getElementById('filledByBot').value){
      $scope.submitNewUser(username);
    }
  }
});