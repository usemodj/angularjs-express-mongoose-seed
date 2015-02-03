'use strict';

var app = angular.module('frontendApp');
app.controller('UserCtrl', ['$scope', 'Users',
    function($scope, Users) {
        $scope.list = function() {

            Users.query(null, function(users) { // success
                console.log('>>Users.query: ');
                console.log(users);
                $scope.users = users;
            }, function(httpRes) { // error
                // var msg = HelperService.GetErrorMessage(httpRes);
                // $notification.error('Data Fetch Failed', msg);
                console.log(httpRes);
            });
        };

        $scope.show = function(userId) {
            console.log('>> userId:');
            console.log(userId);
            Users.get({
                id: userId
            }, function(user) { //Success
                //console.log(user);
                $scope.user = user;
            }, function(httpRes) { //Error
                console.log(httpRes);
            });
        };

        $scope.login = function() {
            console.log($scope.user.email);
            console.log($scope.user.password);
        };
    }
]);
