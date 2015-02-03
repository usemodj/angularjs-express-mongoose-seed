'use strict';

angular.module('frontendApp')
    .controller('NavbarCtrl', ['$scope', 'Authentications', '$location', 
        function($scope, Authentications, $location) {
            $scope.user = Authentications.user;
            $scope.userRoles = Authentications.userRoles;
            $scope.accessLevels = Authentications.accessLevels;

            $scope.logout = function() {
                Authentications.logout(function(err) {

                    if (err) {
                        console.log(err);
                    } else {
                        $location.path('/login');
                    }
                });
            };
        }
    ]);
