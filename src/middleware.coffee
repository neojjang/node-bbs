

exports.isUser = (req, res, next) ->
	if req.session.user
		next()
		return
	else
		req.flash 'warn', 'You need to be logged in to do that.'
		res.redirect('/login?redir=' + req.url);
		return


exports.isSelf = (req, res, next) ->
	if req.params.id is req.session.user._id
		next()
		return
	else
		req.flash 'warn', 'You do not have permission to do that.'
		res.redirect '/'
		return


exports.restrictToRoles = (roles) ->
	(req, res, next) ->
		for role in roles
			if req.session.user.role is role
				next()
				return
		req.flash 'warn', 'You do not have permission to do that.'
		res.redirect '/'
		return
