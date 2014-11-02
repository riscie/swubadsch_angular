'use strict';

var swubadschApp = angular.module('swubadschApp', ['ngRoute', 'ngStorage']);

swubadschApp.config(function($routeProvider) {


  $routeProvider.
    when('/', {
      templateUrl: '/views/chooseUser.html',
      controller: 'ChooseUserCtrl'
    }).
    when('/opportunities', {
      templateUrl: '/views/opportunities.html',
      controller: 'OpportunitiesCtrl'
    }).
    when('/drinkevent/:swudrinkId', {
      templateUrl: '/views/detail.html',
      controller: 'DetailCtrl'
    }).
    otherwise({
      redirectTo: '/'
    });
});



