'use strict';

//Factory for fetching UserData
app.factory('users', function($http){
  function getData(callback){
    $http({
      method: 'GET',
      url: '/api/index.php/users',
      cache: true
    }).success(callback);
  }

  return {
    list: getData,
    find: function(id, callback){
      getData(function(data) {
        var userid = data.filter(function(entry){
          return entry.id === id;
        })[0];
        callback(userid);
      });
    }
  };
});

//Factory for fetching Opportunities  - Refactor using this: http://weblogs.asp.net/dwahlin/using-an-angularjs-factory-to-interact-with-a-restful-service
app.factory('opportunities', function($http){
  function getData(callback){
    $http({
      method: 'GET',
      url: '/api/index.php/opportunities/',
      cache: true
    }).success(callback);
  }

  return {
    list: getData,
    find: function(user_id, callback){
      getData(function(data) {
        var opportunitiesWithDate = data.filter(function(entry){
        return entry.user_id === user_id;
        });
        callback(opportunitiesWithDate);
      });
    },
    };
});


//Factory for signing users in
app.factory('signing', ['$http', function($http) {
      var urlBase = '/api/index.php/opportunities/';
      var dataFactory = {};

  dataFactory.signUserIn = function(day, user_id){
    return $http.post(urlBase, {"date": day, "user_id": user_id})
  };

  dataFactory.signUserOut = function(opportunity_id){
    return $http.delete(urlBase+'/'+opportunity_id)
  };

  return dataFactory;

}]);


//Factory for fetching Comments
app.factory('comments', function($http){
  function getData(callback){
    $http({
      method: 'GET',
      url: '/api/index.php/comments/',
      cache: true
    }).success(callback);
  }

  return {
    list: getData
  };
});

//Factory for creating new Comments
app.factory('newComment', ['$http', function($http) {
  var urlBase = '/api/index.php/comments/';
  var dataFactory = {};

  dataFactory.add = function(user_id, day, text){
    return $http.post(urlBase, {"user_id": user_id, "date": day, "text": text})
  };

  return dataFactory;

}]);


//OpportunitiesCtrl
app.controller('OpportunitiesCtrl', function ($scope, $http, $localStorage, $filter, users, opportunities, signing, comments, newComment, $window, $route){

  $scope.$storage = $localStorage;
  var timeline = [];
  var today = new Date();
  var i;


//Creating the Tilmeline here. From Today ... Today+6 Days
  for (i = 0; i < 7; i++) {
    timeline.push({
      day: new Date(today.getFullYear(),today.getMonth(),today.getDate()+i),
      userParticipates:   false
    });
  }

  $scope.today = today;
  $scope.timeline = timeline;

  opportunities.list(function(opportunities) {
    $scope.opportunities = opportunities;
  });

  comments.list(function(comments) {
    $scope.comments = comments;
  });

  users.find($localStorage.userid, function(currentUser) {
    $scope.currentUser = currentUser;
    opportunities.find($scope.currentUser.id, function(opportunityWithUser){
     $scope.currentUser.opportunities = opportunityWithUser;


      //Iterating trough all opportunities. If the current User participated, modifiy the .userParticipates-boolean
      $scope.timeline.forEach(function (event){
        $scope.currentUser.opportunities.forEach(function (opportunity) {
          if (opportunity.date == $scope.reformat(event.day)) {
            event.userParticipates = true;
            event.id = opportunity.id;
          }
        });
      });
    });
  });





//Fetching all users
  users.list(function(users) {
    $scope.users = users;
  });


/*
  $scope.dayMatcher = function(day) {
    return function(user) {
      return user.groups[0].name === groupFilter;
    }
  };
*/

//Needed to reformat to the MySQL Date format
  $scope.reformat = function(day){
    return $filter('date')(day, 'yyyy-MM-dd');
  }

  $scope.getUsernameById = function getByValue(arr, value) {
    for (var i=0, iLen=arr.length; i<iLen; i++) {
      if (arr[i].b == value) return arr[i];
    }
  }


  $scope.addUserToOpportunity = function(day, user_id){
    signing.signUserIn($scope.reformat(day), user_id);
    setTimeout(function(){$window.location.reload(true)}, 500);
    //$window.location.reload(true);
    //console.log('sign me in on '+$scope.reformat(day));
  }

  $scope.removeUserToOpportunity = function(opportunity_id){
    signing.signUserOut(opportunity_id);
    setTimeout(function(){$window.location.reload(true)}, 500);
    //$window.location.reload(true);
    //console.log('sign me out on from opportunity with it: '+opportunity_id);

  }

  $scope.addComment = function(text, user_id, date){
    newComment.add(user_id, $scope.reformat(date), text);
    setTimeout(function(){$window.location.reload(true)}, 500);
    //$window.location.reload(true);
    //console.log(text+' from '+user_id+' on '+$scope.reformat(date));
  }


});
