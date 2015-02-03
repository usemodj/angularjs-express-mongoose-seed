'use strict';

angular.module('frontendApp')
  .directive('accessLevel', ['Authentications', function (Authentications) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var prevDisp = element.css('display'),
            userRole,
            accessLevel;
        scope.user = Authentications.user;
        scope.$watch('user', function(user){
            if(user.role) userRole = user.role;
            updateCSS();
        }, true);

        attrs.$observe('accessLevel', function(al){
            if(al) accessLevel = scope.$eval(al);
            updateCSS();
        });

        function updateCSS(){
            if(userRole && accessLevel){
                if(!Authentications.authorize(accessLevel, userRole)){
                    element.css('display', 'none');
                } else {
                    element.css('display', prevDisp);
                }
            }
        }
      }
    };
  }]);
