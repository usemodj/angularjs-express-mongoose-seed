'use strict';

angular.module('frontendApp')
    .controller('SignupCtrl', ['$scope', 'Authentications', 'Users', '$state',
        function($scope, Authentications, Users, $state) {
            $scope.register = function(form) {
                Users.countAdmins(function(err, count){
                    console.log(">> count admins: %d", count);
                    // if admin user doesn't exist, create Admin user
                    var role = (count < 1)? Authentications.userRoles.admin: Authentications.userRoles.user;

                    Authentications.createUser({
                            email: $scope.user.email,
                            username: $scope.user.username,
                            password: $scope.user.password,
                            retype_password: $scope.user.retype_password,
                            role: role
                        },
                        function(errData) {
                            $scope.errors = {};
                            console.log(errData);
                            if(errData) {

                                angular.forEach(errData.errors, function(value, key) {
                                    //console.log('>>signup createUser....')
                                    //console.log(key)
                                    var msg = value.message;
                                    var field = key;
                                    if (field === 'encrypted_password') field = 'password';
                                    //console.log('>> field: ' + field);
                                    //console.log('>> msg: ' + msg);
                                    //console.log(form[field]);
                                    form[field].$setValidity('server', false);
                                    $scope.errors[field] = msg;
                                });

                            } else {
                                return $state.go('user.home');
                            }

                        }
                    );
                });
            };
        }
    ]);
