var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var utils = require('../../lib/utils');

module.exports = {
    //login POST
    login: function(req, res, next) {

        passport.authenticate('local', function(err, user, info) {
            var error = err || info;
            if (error) return res.status(400).json(error);
            // Update login info
            //console.log('>> login:' + JSON.stringify(user));
            User.findOne({'email': user.email}, function(err, user){
                if(err) return next(err);

                if(user.active !== true) {
                    return res.status(400).json({message: 'Email is Inactive!'});
                }

                user.current_sign_in_ip= req.ip;
                user.current_sign_in_at= new Date();
                user.last_sign_in_ip= user.current_sign_in_ip;
                user.last_sign_in_at= user.current_sign_in_at;
                user.save(function(err, user) {
                    //console.log(err);
                    if (err) return next(err);
                    //console.log('>>login user:'+ JSON.stringify(user));
                    req.logIn(user, function(err) {
                        if (err) return next(err);
                        //if (req.body.rememberMe) req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 7;
                        res.status(200).json(user);
                    });
                });

            });

        })(req, res, next);
    },
    //logout DELETE
    logout: function(req, res) {
        //console.log('>> logout req.user: '+ JSON.stringify(req.user));
        if (req.user) {
            req.logout();
            res.status(200).end();
        } else {
            res,status(400).send('Not logged in');
        }
    }

};
