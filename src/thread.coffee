# Threads Module


db = require './db'


exports.index = (req, res) ->
	db.Thread.find({}).sort('updatedAt', -1).execFind (err, threads) ->
		if err then throw err
		res.render 'threads', { title: 'Threads', threads: threads }

exports.new = (req, res) ->
	res.render 'threads/new', { title: 'New Thread' }

exports.create = (req, res) ->
	thread = new db.Thread
		title	: 	req.body.thread.title
		uid	:	req.session.user._id
		uname	:	req.session.user.name
		body	:	req.body.thread.body
	
	thread.save (err) ->
		if err then throw err
		db.User.update { _id: req.session.user._id }, { $inc: { threads: 1 } }, (err) ->
			if err then throw err
			res.redirect '/threads'

exports.show = (req, res) ->
	db.Thread.update { _id: req.params.id }, { $inc: { views: 1 } }, () ->
		db.Thread.findById req.params.id, (err, thread) ->
			if err then throw err
			res.render 'threads/show', { title: thread.title, thread: thread }

exports.edit = (req, res) ->
	db.Thread.findById req.params.id, (err, thread) ->
		if err then throw err
		res.render 'threads/edit', { title: 'Edit Thread ' + thread.title, thread: thread }

exports.update = (req, res) ->
	db.Thread.update { _id: req.params.id }, req.body.thread, () ->
		res.redirect '/thread/'+req.params.id

exports.destroy = (req, res) ->
	db.Thread.remove { _id: req.params.id }, (err) ->
		if err then throw err
		res.redirect '/threads'




