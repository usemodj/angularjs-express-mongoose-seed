'use strict';

var services = angular.module('frontendApp');
services.factory('Mails', ['$resource',
        function($resource) {
            return $resource('/auth/mail/', { },{
            	update: { method: 'PUT'}
            });
        }
    ]);
