async = require("async");

/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var User = mongoose.model('User');
var utils = require('../../lib/utils');

module.exports = {

    //search users POST, GET
    index: function(req, res, next) {

        //var Role = req.models.roles;
       // var User = req.models.users;
        var perPages = 20;
        var page = parseInt(req.params['page']) || 1;
        if( isNaN(page) || page < 1) page = 1;
        console.log('>>req.body:'+ JSON.stringify(req.body));
        console.log('>> page:'+ page);

        var email = req.body.email || "";
        var role = req.body.role;
        var active = req.body.active;

        var conditions = {};
        if(email && email.length !== 0) {
            email = new RegExp(email, 'i');
            conditions={email : email};
        }
        if(role !== undefined && role !== null) {
            conditions['role.title'] = role;
        }
        if(active !== undefined && active !== null) conditions.active = active;
        console.log('>>conditions:'+ JSON.stringify(conditions));

        User.aggregate([{$match: conditions}]).sort('-_id').limit(perPages).skip((page -1)*perPages).exec(function(err, users) {
            if (err) {
                console.log(">>error:"+ err);
                return next(err);
            }
            //console.log('>>users:'+ JSON.stringify(users));
            User.count(conditions, function(err, count){
                console.log('>> users.index count:'+ count);
                res.json({
                    users: users,
                    count: count,
                    page: page
                })
            });

        });
    },

    // get '/users/:id?color=red' --> req.params.id, req.query.color
    user: function(req, res, next) {
        User.findById(req.params.id, function(err, user) {
            if (err) return next(err);
            console.log('>>get /users/' + req.params.id);
            console.log(JSON.stringify(user));
            res.json(user);
        });
    },

    //count users
    countAdmins: function(req, res, next){
        User.count({'role.title': 'admin', 'active': true}, function(err, count){
               if(err) return next(err);
                return res.status(200).json(count);
            });
    },

    // post signup
    createUser: function(req, res, next) {
        var email = req.body.email;
        var password = req.body.password;
        var username = req.body.username;
        var role = req.body.role;
        console.log(req.body);

        var user = new User({
            email: email,
            username: username,
            password: password,
            role: role,
            provider: 'local',
            current_sign_in_ip: req.ip,
            current_sign_in_at: new Date()
        });
        user.save(function(err){
            if(err){
                console.log('>> createUser...')
                console.log(err);
                return res.status(400).json(err);
            }

            // manually login the user once successfully signed up
            req.logIn(user, function(err){
                if(err) req.flash('info', 'Sorry! We are not able to log you in!');
                return res.status(200).json(user);
            })
        });

    },

	//put Change Password
    changePassword: function(req, res, next) {
        if (!req.user) return res.json(400, 'Login is required.');
        var password = req.body.password;
        var new_password = req.body.new_password;
        var retype_password = req.body.retype_password;
        var email = req.body.email;

        //console.log('>>changePassword req.body:'+JSON.stringify(req.body));
        User.findOne({
            email: email
        }, function(err, user) {
            if (err) {
                //console.log('>> users findOne err:');
                console.log(err);
                return res.json(400, err);
            }
            //console.log('>> before updating user: '+ JSON.stringify(user));
            //console.log('>> user.password: '+ user.password);
            //console.log('>> encryptPassword: '+ user.encryptPassword(password));
            if(!user || user.hashed_password !== user.encryptPassword(password)){
                return res.status(400).json({message: 'Information is incorrect!'})
            }
            user.password = new_password;
            user.save(function(err, user){
                if (err) {
                    console.log(err);
                    return res.json(400, err);
                }

                console.log('>> updated user: '+ JSON.stringify(user))
                console.info('Password is updated!');
                return res.json(200, 'Password is updated!');
            })

        });
    },
    // put '/users/:id?color=red' --> req.params.id, req.query.color
    changeRole: function(req, res, next){
        var role = req.body.role;
        var active = req.body.active;
        var id = req.body.id;
        console.log('>> changeRole req.body:'+ JSON.stringify(req.body));
        User.findById(id, function(err, user){
            user.role = role;
            user.active = active;
            user.save(function(err) {
                if (!err) {
                    console.log('Role is updated!');
                    console.log('>>changeRole user:'+ JSON.stringify(user));
                    return res.json(200, 'Role is updated!');
                } else {
                    console.log(err);
                    return res.json(400, err);
                }
            });

        });
    }

};
