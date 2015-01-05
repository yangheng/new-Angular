'use strict';

/**
 * @ngdoc directive
 * @name appApp.directive:ngMiniEditor
 * @description
 * # ngMiniEditor
 */
angular.module('appApp')
  .controller('ngMiniCtr',['$scope',function($scope){
       var Ctr=this,
        editors=Ctr.editors=$scope.editors=[];
        Ctr.addEditors=function(editor){
            editors.push(editor);
        }
        Ctr.removeEditors=function(editor){
            var index = editors.indexOf(editor);
            editors.splice(index, 1);
        }
        $scope.on('$destory',function(){

        })
        $scope.add=function(){

        }
}])
  .directive('ngMiniEditor', function () {
    return {
      templateUrl: 'views/editorset.html',
      restrict: 'E',
      transclude:true,
      controller:'ngMiniCtr',
      link: function postLink(scope, element, attrs) {
        element.text('this is the ngMiniEditor directive');
      }
    };
  });
