# Sessions Module


db = require './db'


exports.new = (req, res) ->
	res.render 'sessions/new', { title: 'Login', redir: req.query.redir }

exports.create = (req, res) ->
	db.User.findOne { name: req.body.name }, (err, user) ->
		if err then throw err
		if user
			db.User.update { _id: user._id }, { $inc: { logins: 1 }, lastLogin: Date.now() }, (err) ->
				if err then throw err
				req.session.user = user
				req.flash 'info', 'Welcome back, '+user.name+'.'
				res.redirect req.body.redir || '/'
		else
			req.flash 'warn', 'Login Failed.'
			res.render 'sessions/new', 
				title: 'Login'
				redir: req.query.redir

exports.destroy = (req, res) ->
	delete req.session.user;
	res.redirect '/login'





