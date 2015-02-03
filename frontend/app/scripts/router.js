'use strict';

angular.module('frontendApp.router', ['ui.router'])
    .config(['$stateProvider', '$urlRouterProvider', '$httpProvider',
        function ($stateProvider,   $urlRouterProvider, $httpProvider) {
            var access = routingConfig.accessLevels;

            // Public controllers
            $stateProvider
                .state('public', {
                    abstract: true,
                    template: "<ui-view/>",
                    data: {
                        access: access.public
                    }
                })
                .state('public.404', {
                    url: '/404/',
                    templateUrl: 'views/404.html'
                });

            // Anonymous controllers
            $stateProvider
                .state('anon', {
                    abstract: true,
                    template: "<ui-view/>",
                    data: {
                        access: access.anon
                    }
                })
                .state('anon.login', {
                    url: '/login/',
                    templateUrl: '/views/partials/login.html',
                    controller: 'LoginCtrl'
                })
                .state('anon.signup', {
                    url: '/signup/',
                    templateUrl: '/views/partials/signup.html',
                    controller: 'SignupCtrl'
                })
                .state('anon.mail', {
                    url: '/mail/',
                    templateUrl: '/views/partials/mail.html',
                    controller: 'MailCtrl'
                })
                .state('anon.passwordToken', {
                    url: '/resetPassword/:passwordToken/',
                    templateUrl: '/views/partials/resetPassword.html',
                    controller: 'MailCtrl'
                })
                .state('anon.resetPassword', {
                    url: '/resetPassword/?:passwordToken',
                    templateUrl: '/views/partials/resetPassword.html',
                    controller: 'MailCtrl'
                });

            // Regular user controllers
            $stateProvider
                .state('user', {
                    abstract: true,
                    template: "<ui-view/>",
                    data: {
                        access: access.user
                    }
                })
                .state('user.home', {
                    url:'/',
                    templateUrl: '/views/main.html'
                })
                .state('user.password', {
                    url: '/password/',
                    templateUrl: '/views/partials/password.html',
                    controller: 'PasswordCtrl'
                });

            // Admin controllers
            $stateProvider
                .state('admin', {
                    abstract: true,
                    templateUrl: 'views/partials/admin/layout.html',
                    data: {
                        //access: access.user
                    }
                })
                .state('admin.users', {
                    abstract: true,
                    url: '/users/',
                    templateUrl: 'views/partials/admin/users/layout.html'
                })
                .state('admin.users.list', {
                    url: 'page/:page',
                    templateUrl: 'views/partials/admin/users/users.list.html',
                    controller: 'AdminUserCtrl'
                })
                .state('admin.users.edit', {
                    url: ':id',
                    templateUrl: 'views/partials/admin/users/users.edit.html',
                    controller: 'UserEditCtrl',
                    resolve: {
                        user: function(Users, $stateParams){
                            return Users.get({id: $stateParams.id});
                        }
                    }
                })
            ;

            $urlRouterProvider.when('', '/');
            $urlRouterProvider.otherwise('/404');

        }
    ]);