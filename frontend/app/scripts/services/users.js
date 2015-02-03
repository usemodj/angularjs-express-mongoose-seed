'use strict';
/*
 * $resource: The default set contains these actions:

  { 'get':    {method:'GET'},
    'save':   {method:'POST'},
    'query':  {method:'GET', isArray:true},
    'remove': {method:'DELETE'},
    'delete': {method:'DELETE'} 
    };
 */
var services = angular.module('frontendApp');
services.factory('Users', ['$http', '$resource',
    function($http, $resource) {
        var resource = $resource('/users/:id',{id:'@id'}, {update: {method: 'PUT'}});

        return {
            query: function () { //GET
                return resource.query();
            },
            get: function(data, callback){ //GET
                /*
                var cb = callback || angular.noop;
                resource.get(data, function(user){
                    //console.log(user);
                    return cb(null, user);
                }, function(err){
                    return cb(err, null);
                });
                */
                return resource.get(data);
            },
            update: function(data, callback){ //PUT

                var cb = callback || angular.noop;
                resource.update(data, function( user){
                    return cb(null, user);
                }, function(err){
                    return cb(err, null);
                });

            },
            save: function(data, callback){ //POST

                var cb = callback || angular.noop;
                resource.save(data, function(user){
                    //console.log(data)
                    return cb(null, user);
                }, function(err){
                    //console.log(">> resource save error...")
                    console.log(err)
                    return cb(err, null);
                });

            },
            remove: function(data){ //DELETE
                return resource.remove(data);
            },

            countAdmins: function(callback){
                var cb = callback || angular.noop;
                $http.get('/users/count_admins')
                    .success(function(data, status, headers, config){
                        //console.log('>> status:'+ status);
                        return cb(null, data);
                    }).error(function(data, status, headers, config) {
                        console.log('>> error data:'+ data);
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                        return cb(status, data);
                    });
            }
        };
    }
]);
