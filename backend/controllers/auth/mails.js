var mongoose = require('mongoose');
var User = mongoose.model('User');
var config = require('config');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var smtpPool = require('nodemailer-smtp-pool');
// Create a SMTP transport object
var transporter = nodemailer.createTransport(smtpPool({
        service: 'Gmail', // use well known service.
        // If you are using @gmail.com address, then you don't
        // even have to define the service name
        auth: {
            user: config.mailer.user,
            pass: config.mailer.pass
        }
    }));

module.exports = {
    //get reset_password_token
    //app.get('/auth/mail',
    reset_password_token: function (req, res, next) {
        console.log(req.body);
        console.log(req.query);
        var email = req.query.email;

        User.findOne({email: email}, function (err, user) {
            if (err) {
                //console.log('>> get /auth/mail error:');
                console.log(err);
                return next(err);
            }
            //console.log('>> get /auth/email user:');
            console.log(user);
            if (!user) {
                var errors = [
                    {
                        property: 'email',
                        msg: 'Email does not found!'
                    }
                ];

                return res.status(400).json( errors);
            }

            user.reset_password_token = user.encryptPassword(user.makeSalt());
            user.save(function (err, user) {
                if (!err) {
                    //console.log('Reset password token!');
                    return res.status(200).json( user);
                } else {
                    console.log(err);
                    return res.status(400).json( err);
                }
            });
        });
    },

    //mail password
    //app.post('/auth/mail',
    mail_password: function (req, res, next) {
        //var transporter = req.transport;
        console.log(req.body);
        var message = {};
        //message.to = req.body.email;
        message = req.body.message;
        transporter.sendMail(message, function (error) {
            if (error) {
                console.log('Error occured');
                console.log(error.message);
                return next(error);
            }
            console.log('Message sent successfully!');

            // if you don't want to use this transport object anymore, uncomment following line
            //transport.close(); // close the connection pool
            return res.status(200).json( 'Message sent successfully!');
        });
    },

    // Reset password
    //app.put('/auth/mail',
    reset_password: function(req, res,  next){
        console.log(req.body);
        var email = req.body.email;
        var reset_password_token = req.body.reset_password_token;
        var password = req.body.password;
        //var retype_password = req.body.password;

        User.findByPasswordToken({
            email: email,
            reset_password_token: reset_password_token
        }, function(err, user) {
            if (err) {
                //console.log('>> users findOne err:');
                console.log(err);
                return res.json(400, err);
            }
            console.log('>>/users put');
            console.log(JSON.stringify(user));

            user.hashed_password = user.encryptPassword( password);
            user.reset_password_token = user.encryptPassword(user.makeSalt());
            user.save(function(err) {
                if (!err) {
                    console.log('Password is updated!');
                    return res.status(200).json('Password is updated!');
                } else {
                    console.log(err);
                    return res.status(400).json(err);
                }
            });
        });

    }

}
