'use strict';

angular.module('frontendApp')
    .controller('PasswordCtrl', ['$rootScope', '$scope', 'Authentications', '$location',
        function($rootScope, $scope, Authentications, $location) {

            $scope.user = Authentications.user;

            $scope.changePassword = function(form) {

                Authentications.changePassword(
                    $scope.user.email,
                    $scope.user.password,
                    $scope.user.new_password,
                    $scope.user.retype_password, function(errors) {
                        $scope.errors = {};
                        $scope.success = {};

                        if (errors) {
                            // console.log( err);
                            angular.forEach(errors, function(error) {
                                var msg = error.msg;
                                var field = error.property;
                                if (field === 'encrypted_password') field = 'password';
                                console.log('>> field: ' + field);
                                console.log('>> msg: ' + msg);
                                console.log(form[field]);
                                form[field].$setValidity('server', false);
                                $scope.errors[field] = msg;
                            });
                        } else {
                            form['password'].$setValidity('server', true);
                            $scope.success['password'] = 'Password changed.';
                            //$location.path('/');
                        }
                    });
            };
        }
    ]);
