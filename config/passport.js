const LocalStrategy = require('passport-local').Strategy;
// const FacebookStrategy = require('passport-facebook').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');



const Estructura = require('../models/estructura_bd.js');
const UserSchema = Estructura.UserSchema;
// UserSchema.methods.generateHash = function(password){
// 	return bcrypt.hashSync(password, bcrypt.genSaltSync(9));
// }

// UserSchema.methods.validPassword = function(password){
// 	return bcrypt.compareSync(password, this.local.password);
// }
const User = mongoose.model("User", UserSchema);

//const configAuth = require('./auth');

module.exports = function(passport) {


	passport.serializeUser(function(user, done){
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done){
		User.findById(id, function(err, user){
			done(err, user);
		});
	});


	passport.use('local-signup', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	},
	function(req, email, password, done){
		//console.log("Entre en passport-register");
		//console.log("Passport. Register-local:"+email);
		//console.log("Passport. Register-local:"+password);
		process.nextTick(function(){
			User.findOne({'local.username': email}, function(err, user){
				if(err)
					return done(err);
				if(user){
					return done(null, false, req.flash('signupMessage', 'Usuario no disponible'));
				} else {
					var newUser = new User();
					newUser.local.username = email;
					newUser.local.password = bcrypt.hashSync(password, bcrypt.genSaltSync(9));
					newUser.local.password = password;
					newUser.save(function(err){
						if(err)
							throw err;
						//console.log("Id del user:"+newUser._id);
						return done(null, newUser);
					})
				}
			})

		});
	}));

	passport.use('local-login', new LocalStrategy({
			usernameField: 'email',
			passwordField: 'password',
			passReqToCallback: true
		},
		function(req, email, password, done){
			//console.log("Entre en passport-login");
			//console.log("Passport. Login-local:"+email);
			//console.log("Passport. Login-loca:"+password);
			process.nextTick(function(){
				User.findOne({ 'local.username': email}, function(err, user){
					if(err)
					{
						//console.log("Error:"+err);
						return done(err);
					}
					if(!user)
					{
						//console.log("No se ha encontrado usuario");
						return done(null, false, req.flash('loginMessage', 'Usuario no encontrado'));
					}
					
					if(password != user.local.password){
						//console.log("Password no valida");
						//console.log("Password:"+password);
						//console.log("Password:"+user.local.password);
						return done(null, false, req.flash('loginMessage', 'Password no valida'));
					}
					return done(null, user);

				});
			});
		}
	));
};