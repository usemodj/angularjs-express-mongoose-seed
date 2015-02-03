'use strict';

var services = angular.module('frontendApp');
services.factory('Authentications', ['$location', '$rootScope','$cookieStore','Sessions', 'Users', 'Mails',
        function($location, $rootScope, $cookieStore, Sessions, Users, Mails) {
            var accessLevels = routingConfig.accessLevels,
                userRoles = routingConfig.userRoles,
                currentUser = $cookieStore.get('user') || {email:'', role: userRoles.public};

            //$cookieStore.remove('user');

            function changeUser(user){
                angular.extend(currentUser, user);
            }

            return {
                accessLevels: accessLevels,
                userRoles: userRoles,
                user: currentUser,

                authorize: function(accessLevel, role){
                    if(role === undefined){
                        role = currentUser.role;
                    }
                    if(accessLevel === undefined){
                        accessLevel = accessLevels.public;
                    }
                    //console.log( accessLevel);
                    $rootScope.currentUser = currentUser;
                    return (accessLevel.bit_mask & role.bit_mask);
                },

                isLoggedIn: function(user){
                    if(user === undefined){
                        user = currentUser;
                    }
                    return user.role && (user.role.title === userRoles.user.title || user.role.title === userRoles.admin.title);
                },

                login: function(provider, userinfo, callback) {
                    console.log('>> auth login');
                    var cb = callback || angular.noop;
                    Sessions.save({
                        provider: provider,
                        email: userinfo.email,
                        password: userinfo.password,
                        rememberMe: userinfo.rememberMe
                    }, function(user) {
                        //console.log('>> login user:'+JSON.stringify(user));
                        $rootScope.currentUser= user;
                        $cookieStore.put('user', user);
                        changeUser(user);
                        return cb();
                    }, function(err) {
                        console.log('>> login error:'+ JSON.stringify(err));
                        return cb(err.data);
                    });
                },

                logout: function(callback) {
                    var cb = callback || angular.noop;
                    Sessions.delete(function(res) {
                            $rootScope.currentUser = null;
                            $cookieStore.remove('user');
                            changeUser({
                                email:'',
                                role: userRoles.public
                            });
                            return cb();
                        },
                        function(err) {
                            //console.log(err);
                            return cb(err.data);
                        });
                },

                createUser: function(userinfo, callback) {
                    var cb = callback || angular.noop;
                    Users.save(userinfo,
                        function(err, user) {
                            if(err) {
                                console.log('>> createUser err.data: ');
                                console.log(err.data);
                                return cb(err.data);
                            }
                            $rootScope.currentUser = user;
                            $cookieStore.put('user', user);
                            changeUser(user);
                            return cb(null);
                        }
                    );
                },

                changeRole: function(user, callback) {
                    var cb = callback || angular.noop;
                    console.log(user)
                    Users.update(user, function(err, user) {
                        if(err) {
                            console.log('>> updateUserRole error: ');
                            console.log(err);
                            return cb(err.data);
                        }

                        console.log('updateUserRole changed');
                        console.log('>> user: ' + user);
                        changeUser(user);
                        return cb(null);

                    });


                },

                changePassword: function(email, oldPassword, newPassword, retypePassword, callback) {
                    var cb = callback || angular.noop;
                    Users.update({
                        email: email,
                        password: oldPassword,
                        new_password: newPassword,
                        retype_password: retypePassword
                    }, function(err, user) {
                        if(err) {
                            console.log('>> changePassword: ');
                            console.log(err);
                            return cb(err.data);
                        }

                        console.log('password changed');
                        console.log('>> user: ' + user);
                        return cb();
                    });
                },

                removeUser: function(email, password, callback) {
                    var cb = callback || angular.noop;
                    Users.delete({
                        email: email,
                        password: password
                    }, function(user) {
                        console.log(user + 'removed');
                        return cb();
                    }, function(err) {
                        return cb(err.data);
                    });
                },

                passwordToken: function(email, callback) {
                  Mails.get({email: email}, 
                    function(user){
                	  	console.log('>> passwordToken user:');
                	  	console.log(user);
                      return callback(null, user);
                  }, function(err){
                	  console.log('>> passwordToken error:');
                      console.log(err);
                    return callback(err.data);
                  });
                },

                mailResetPassword: function(email, message, callback) {
                    var cb = callback || angular.noop;
                    Mails.save({
                        email: email,
                        message: message
                    }, function(mail) {
                    		console.log('>> mailPassword success: ');
                    		console.log(mail);
                        return cb();
                    }, function(err) {
                        console.log('>> mailPassword err: ');
                        console.log(err);
                        return cb(err.data);
                    });
                },
                
                resetPasswordByToken: function(email, resetPasswordToken, password, retypePassword, callback){
                	var cb = callback || angular.noop;
                	Mails.update({
                        email: email,
                		reset_password_token: resetPasswordToken,
                		password: password,
                		retype_password: retypePassword
                	}, function(user){
                		console.log(user);
                		return cb();
                	}, function(err){
                		console.log(err);
                		return cb(err.data);
                	});
                }
            };
        }
    ]);
