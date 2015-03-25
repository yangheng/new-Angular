'use strict';

/**
 * @ngdoc overview
 * @name appApp
 * @description
 * # appApp
 *
 * Main module of the application.
 */
angular
  .module('appApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'

  ])
  .config(['$routeProvider','$locationProvider',function ($routeProvider,$locationProvider) {

        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            })
            .when('/search/:key', {
                templateUrl: 'views/search.html',
                controller: 'SearchCtrl'
            })
            .when('/myRoute', {
                templateUrl: 'views/template.html',
                controller: 'MyrouteCtrl'
            })
            .when('/my/route', {
                templateUrl: 'views/newroute.html',
                controller: 'NewrouteCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
       //$locationProvider.html5Mode(true);
    }] )

