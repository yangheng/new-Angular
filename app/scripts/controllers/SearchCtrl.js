'use strict';

/**
 * @ngdoc function
 * @name appApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the appApp
 */
angular.module('appApp')
  .controller('SearchCtrl', SearchCtrl);

   SearchCtrl.$inject=['$scope','$routeParams','$http','$interval','$window'];

    function SearchCtrl($scope,$routeParams,$http,$interval,$window){
    $scope.init=init;
    $scope.getCode=getCode;
    $scope.showNum=12;
    $scope.scrollIndex=0;
    $scope.LoadData=LoadData;
    $scope.searchData=[];
    $scope.isAjax=false;

    var Data=[],upCase=0;
    $scope.scrollNum=0;
    var h=window.innerHeight
        || document.documentElement.clientHeight
        || document.body.clientHeight;
    angular.element($window).bind('scroll',function(event){
        if(window.scrollY>upCase){
            $scope.scrollNum=document.querySelectorAll('.row')[1].getBoundingClientRect().bottom-h;
            upCase=window.scrollY;
            $scope.$apply();
        }


    })
    $scope.$watch('scrollNum',function(newV,oldV){
         console.log(newV)
        if((newV!=0)&&(newV!=oldV) && (newV<=50) && (!$scope.end)){
            $scope.LoadData();
        }
    })
    function init(){
         $http.post('/data/search',{'keyword':$routeParams.key},{"headers" : { "Content-Type" : "application/json;charset=GBK" }})
            .success(function(data){
                 $scope.isAjax=true;
                Data=data;
                $scope.LoadData();
            })
            .error(function(data){
                console.log(data)
            })
    }
    function getCode(ref){
        if(ref.code){
            ref.codeCtr=true;
            return ref;
        }else{
            ref.loading=true;
            $http.post('/data/getCode',{'keyword':ref.href}).success(function(data){
                ref.loading=false;
                ref.code=data.code;
                ref.codeCtr=true;
                return ref;
            })
            .error(function(data){
                console.log(data)
            })
        }
    }
    function LoadData(){
            if($scope.isAjax){
                $scope.searchData= $scope.searchData.concat(Data.slice($scope.scrollIndex,$scope.showNum+$scope.scrollIndex));
                $scope.scrollIndex+=$scope.showNum;
                if(Data.length>$scope.scrollIndex){
                    $scope.end=false;
                }else{
                    $scope.end=true;
                }
            }


    }
    $scope.init();
}