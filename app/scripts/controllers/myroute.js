'use strict';

/**
 * @ngdoc function
 * @name appApp.controller:MyrouteCtrl
 * @description
 * # MyrouteCtrl
 * Controller of the appApp
 */
angular.module('appApp')
  .controller('MyrouteCtrl',['$scope','$http','$interval','$timeout',function ($scope,$http,$interval,$timeout) {
        $scope.localData={},
        $scope.uri="/getData"+Math.random();
        $scope.init=init;
        $scope.SearchLoad=SearchLoad;

        function SearchLoad(){
            alert('serach');
        }
        function init(){
            $http.post($scope.uri).success()
        };

}] );
