# Users Module


db = require './db'



exports.index = (req, res) ->
	db.User.find {}, (err, users) ->
		if err then throw err
		res.render 'users', { title: 'Users', users: users }

exports.new = (req, res) ->
	res.render 'users/new', { title: 'Registration', user: { name: '', email: '' } }

exports.create = (req, res) ->
	user = new db.User req.body.user
	user.save (err) ->
		if err then throw err
		req.flash 'info', 'User created sucessfully, now please login.'
		res.redirect '/login'

exports.show = (req, res) ->
	db.User.findById req.params.id, (err, user) ->
		if err then throw err
		res.render 'users/single', { title: user.name, user: user }

exports.edit = (req, res) ->
	db.User.findById req.params.id, (err, user) ->
		if err then throw err
		res.render 'users/edit', { title: 'Edit User ' + user.name, user: user }

exports.update = (req, res) ->
	db.User.update { _id: req.params.id }, req.body.user, () ->
		req.session.user.name = req.body.user.name
		res.redirect '/user/'+req.params.id

#exports.destroy = (req, res) ->





