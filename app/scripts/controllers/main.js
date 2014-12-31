'use strict';

/**
 * @ngdoc function
 * @name appApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the appApp
 */
angular.module('appApp')
    .filter('nestfilter',function(){
        return function(input){

        }
    })
  .controller('MainCtrl',['$scope','$http',function ($scope,$http) {
        $scope.data=[];
        $scope.BaseUri="/data/getJson";
        $scope.init=init;
        function init(){
            $http.post($scope.BaseUri)
                .success(function(data, status, headers, config){
                    $scope.data=data;
                })
                .error(function(data, status, headers, config){
                    alert(data);
                })
        }

       }] )

