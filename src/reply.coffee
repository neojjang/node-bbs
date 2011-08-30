# Replies Module


db = require './db'


#exports.index = (req, res) ->
#	db.Thread.find {}, (err, threads) ->
#		if err then throw err
#		res.render 'threads', { title: 'Threads', threads: threads }

#exports.new = (req, res) ->
#	res.render 'threads/new', { title: 'New Thread', thread: { title: '', body: '' } }

exports.create = (req, res) ->
	db.Thread.findById req.params.tid, (err, thread) ->
		if err then throw err
		thread.replies.push
			id		:	thread.repliesnum+1
			uid	:	req.session.user._id
			uname	:	req.session.user.name
			body	:	req.body.reply
		thread.save (err) ->
			if err then throw err
			db.Thread.update { _id: thread._id }, { $inc: { repliesnum: 1 }, bump: Date() }, (err) ->
				if err then throw err
				db.User.update { _id: req.session.user._id }, { $inc: { replies: 1 } }, (err) ->
					if err then throw err
					res.redirect '/thread/'+thread._id

#exports.show = (req, res) ->
#	db.Thread.findById req.params.id, (err, thread) ->
#		if err then throw err
#		res.render 'threads/single', { title: thread.title, thread: thread }

exports.edit = (req, res) ->
	db.Thread.findById req.params.tid, (err, thread) ->
		if err then throw err
		res.render 'replies/edit', { title: 'Edit Reply', thread: thread, reply: thread.replies.id req.params.id }

exports.update = (req, res) ->
	db.Thread.findById req.params.tid, (err, thread) ->
		if err then throw err
		reply = thread.replies.id req.params.id
		reply.body = req.body.reply.body
		
		res.render 'replies/edit', { title: 'Edit Reply', thread: thread, reply: thread.replies.id req.params.id }




#exports.update = (req, res) ->
#	db.Thread.update { 'replies._id': req.params.id }, { $set: { body: req.body.body } }, () ->
#		res.redirect '/thread/'+req.params.tid

#exports.destroy = (req, res) ->
#	db.Thread.remove { _id: req.params.id }, (err) ->
#		if err then throw err
#		res.redirect '/threads'





