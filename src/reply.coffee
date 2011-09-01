# Replies Module


db = require './db'



exports.create = (req, res) ->
	db.Thread.findById req.params.tid, (err, thread) ->
		if err then throw err
		thread.replies.push
			id		:	thread.replies.length+1
			uid	:	req.session.user._id
			uname	:	req.session.user.name
			body	:	req.body.reply
		thread.save (err) ->
			if err then throw err
			db.User.update { _id: req.session.user._id }, { $inc: { replies: 1 } }, (err) ->
				if err then throw err
				res.redirect '/thread/'+thread._id

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


#exports.destroy = (req, res) ->
#	db.Thread.findById req.params.tid, (err, thread) ->
#		if err then throw err
#		reply = thread.replies.id req.params.id
#		reply.remove()
#		thread.save (err) ->
#			if err then throw err
#			res.redirect '/thread/'+thread._id





