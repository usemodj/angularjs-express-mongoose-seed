var _ = require('underscore')
    , path = require('path')
    , userRoles = require('../../frontend/app/scripts/common/routingConfig').userRoles
    , accessLevels = require('../../frontend/app/scripts/common/routingConfig').accessLevels
    , SessionCtrl =  require('../controllers/auth/sessions')
    , UserCtrl =  require('../controllers/auth/users')
    , MailCtrl =  require('../controllers/auth/mails')
    ;

var routes = [

    // Views
//    {
//        path: '/partials/*',
//        httpMethod: 'GET',
//        middleware: [function (req, res) {
//            var requestedView = path.join('./', req.url);
//            res.render(requestedView);
//        }]
//    },
    // Local Auth
    {
        path: '/auth/session',
        httpMethod: 'POST',
        middleware: [SessionCtrl.login]
    },
    {
        path: '/auth/session',
        httpMethod: 'DELETE',
        middleware: [SessionCtrl.logout]
    },
    {
        path: '/auth/mail',
        httpMethod: 'GET',
        middleware: [MailCtrl.reset_password_token]
    },
    {
        path: '/auth/mail',
        httpMethod: 'POST',
        middleware: [MailCtrl.mail_password]
    },
    {
        path: '/auth/mail',
        httpMethod: 'PUT',
        middleware: [MailCtrl.reset_password]
    },

    // User resource
    {
        path: '/users/',
        httpMethod: 'POST',
        middleware: [UserCtrl.createUser]
    },
    {
        path: '/users/count_admins',
        httpMethod: 'GET',
        middleware: [UserCtrl.countAdmins]
    },

    {
        path: '/users/page/:page?',
        httpMethod: 'GET',
        middleware: [UserCtrl.index],
        accessLevel: accessLevels.admin
    },
    {   //searchUsers
        path: '/users/page/:page?',
        httpMethod: 'POST',
        middleware: [UserCtrl.index],
        accessLevel: accessLevels.admin
    },

    {   //get user
        path: '/users/:id',
        httpMethod: 'GET',
        middleware: [UserCtrl.user],
        accessLevel: accessLevels.user
    },

    {
        path: '/users',
        httpMethod: 'PUT',
        middleware: [UserCtrl.changePassword],
        accessLevel: accessLevels.user
    },
    {
        path: '/users/:id',
        httpMethod: 'PUT',
        middleware: [UserCtrl.changeRole],
        accessLevel: accessLevels.admin
    },

    // All other get requests should be handled by AngularJS's client-side routing system
    {
        path: '/*',
        httpMethod: 'GET',
        middleware: [function(req, res) {
            var role = userRoles.public, email = '', username = '';
            if(req.user) {
                role = req.user.role;
                email = req.user.email;
                username = req.user.username;
            }
            res.cookie('user', JSON.stringify({
                'username': username,
                'email': email,
                'role': role
            }));
            res.render('index');
        }]
    }
];

module.exports = function(app) {
    //console.log('>> routes loading...');
    _.each(routes, function(route) {
        route.middleware.unshift(ensureAuthorized);
        var args = _.flatten([route.path, route.middleware]);

        switch(route.httpMethod.toUpperCase()) {
            case 'GET':
                app.get.apply(app, args);
                break;
            case 'POST':
                app.post.apply(app, args);
                break;
            case 'PUT':
                app.put.apply(app, args);
                break;
            case 'DELETE':
                app.delete.apply(app, args);
                break;
            default:
                throw new Error('Invalid HTTP method specified for route ' + route.path);
                break;
        }
    });
}

function ensureAuthorized(req, res, next) {
    var role;
    //var accessLevel = _.findWhere(routes, { path: req.route.path, httpMethod: req.route.method.toUpperCase() }).accessLevel || accessLevels.public;
    var accessLevel = _.findWhere(routes, { path: req.route.path, httpMethod: req.method.toUpperCase() }).accessLevel || accessLevels.public;
    if(!req.user) role = userRoles.public;
    else if(req.user.role) role = req.user.role;
    if(role) {
        //console.log('>>ensureAuthorized req.user:');
        //console.log(JSON.stringify(req.user));
        if (!(accessLevel.bit_mask & role.bit_mask)) return res.status(403).end();
        return next();
    }
    return next();
}
