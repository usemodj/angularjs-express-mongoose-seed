'use strict';

var services = angular.module('frontendApp');
services.factory('Sessions', ['$resource',
        function($resource) {
            return $resource('/auth/session', {});
        }
    ]);
