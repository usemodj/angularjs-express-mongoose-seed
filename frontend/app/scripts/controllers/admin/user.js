'use strict';

angular.module('frontendApp')
  .controller('AdminUserCtrl', ['$scope', '$http','$state', '$stateParams', 'Users', '$window',
        function ($scope, $http, $state, $stateParams, Users, $window) {
    $scope.page = $stateParams.page;
    $scope.data = {};
    $scope.conditions = {};
    $scope.roles = [];
    for(var k in $window.routingConfig.userRoles){
        $scope.roles.push($window.routingConfig.userRoles[k]);
    }

    $scope.pageChanged = function() {
        $scope.searchUsers();
    };

/*
    $scope.deleteUser = function(user) {
        user.$delete().then(function(){
            $scope.data.users.splice($scope.users.indexOf(user), 1);
        });
        $location.path('/admin/users/');
    };

    $scope.createUser = function(user){
        new Users(user).$save().then(function(newUser){
            $scope.data.users.push(newUser);
            $location.path('/admin/users');
        })
    };
*/
    $scope.searchUsers = function(){
        $http.post('/users/page/'+$scope.page,{
            email: $scope.conditions.email,
            role: $scope.conditions.role,
            active: $scope.conditions.active
        }).success(function(results, status){
            console.log('>> status:'+ status);
            $scope.data.users = results.users;
            $scope.totalItems = results.count;
            $scope.page = results.page;
        });
    };

    $scope.searchUsers();
  }])
    .controller('UserEditCtrl', ['$scope', '$state', '$stateParams', 'Authentications', 'Users', 'user', '$window',
        function ($scope, $state, $stateParams, Authentications,Users, user, $window) {
        $scope.currentUser = user;
        $scope.page = $stateParams.page;
        $scope.roles = [];
        for(var k in $window.routingConfig.userRoles){
            $scope.roles.push($window.routingConfig.userRoles[k]);
        }

        $scope.updateRole = function(){
            console.log('>> currentUser:'+ JSON.stringify($scope.currentUser));
            Authentications.changeRole({
                id: $scope.currentUser._id,
                email: $scope.currentUser.email,
                role: $scope.currentUser.role,
                active: $scope.currentUser.active
            }, function(err) {
                if(err){
                    console.log('>> changeRole error: ');
                    console.log(err);
                    $scope.error = err.message;
                } else {
                    //$state.go('admin.user.home');
                    $state.go('admin.users.list',{page: $scope.page});
                }
            });
        };

//        $scope.updateUserRole = function(user){
//            //user.$update({role_id: user.role_id});
//            //user.$update();
//            Users.update({
//                id: user.id,
//                email: user.email,
//                role_id: user.role_id,
//                active: user.active
//            }, function(user) {
//                console.log('updateUserRole changed');
//                console.log('>> user: ' + user);
//
//            }, function(err) {
//                console.log('>> updateUserRole error: ');
//                console.log(err);
//
//            });
//
//            //$location.path('/admin/users');
//            //$state.go('admin.users.list');
//        };

//        $scope.editUser = function(user){
//            $scope.currentUser = user;
//            $state.go('/admin/users/edit',{id: user.id});
//
//        };

//        $scope.saveEdit = function(user){
//            if(angular.isDefined(user.id)){
//                $scope.updateUser(user);
//            } else {
//                $scope.createUser(user);
//            }
//            $scope.currentUser = {};
//        };

        $scope.cancelEdit = function(){
            if($scope.currentUser && $scope.currentUser.$get){
                $scope.currentUser.$get();
            }
            $scope.currentUser = {};
            $state.go('admin.users.list',{page: $scope.page});
        };

    }]);
