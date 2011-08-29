

# External lib
express	= 	require 'express'


# Internal lib
mw			=	require './lib/middleware'
db			=	require './lib/db'
site		=	require './lib/site'
user		=	require './lib/user'
reply		=	require './lib/reply'
thread	=	require './lib/thread'
session	=	require './lib/session'


# Configuration

app = module.exports = express.createServer()

app.configure () ->
	secret = '30d8689332f7091b0b868926502bf690'
	app.set 'views', __dirname + '/views'
	app.set 'view engine', 'jade'
	app.use express.bodyParser()
	app.use express.methodOverride()
	app.use express.cookieParser()
	app.use express.session 
		secret: secret
	app.use require('stylus').middleware
		src: __dirname + '/public'
	app.use app.router
	app.use express.static __dirname + '/public'
	return

app.configure 'development', () ->
	app.use express.static __dirname + '/public'
	app.use express.errorHandler
		dumpExceptions: true
		showStack: true
	return

app.configure 'production', () ->
	oneYear = 31557600000
	app.use express.static __dirname + '/public',
		maxAge: oneYear
	app.use express.errorHandler
	return

app.dynamicHelpers
	session: (req, res) ->
		req.session
	flash: (req, res) ->
		req.flash()
	url: (req, res) ->
		req.url
	isUser: (req, res) ->
		if req.session.user then true
	isAdmin: (req, res) ->
		if req.session.user and (req.session.user.role is 'admin') then true
	isMod: (req, res) ->
		if req.session.user and (req.session.user.role is 'mod') then true


# Site Routes

app.get '/', site.index


# Session Routes

app.get '/login', session.new
app.post '/login', session.create
app.get '/logout', session.destroy


# User Routes

app.get '/users', user.index
app.get '/register', user.new
app.post '/register', user.create
app.get '/user/:id', user.show
app.get '/user/:id/edit', mw.isUser, mw.isSelf, user.edit
app.put '/user/:id', mw.isUser, mw.isSelf, user.update


# Thread Routes

app.get '/threads', thread.index
app.get '/threads/new', mw.isUser, thread.new
app.post '/threads', mw.isUser, thread.create
app.get '/thread/:id', thread.show
app.get '/thread/:id/edit', mw.isUser, mw.restrictToRoles(['mod', 'admin']), thread.edit
app.put '/thread/:id', mw.isUser, mw.restrictToRoles(['mod', 'admin']), thread.update
app.get '/thread/:id/delete', mw.isUser, mw.restrictToRoles(['mod', 'admin']), thread.destroy


# Reply Routes

app.post '/thread/:tid/replies', mw.isUser, reply.create
app.get '/thread/:tid/reply/:id/edit', mw.isUser, mw.restrictToRoles(['mod', 'admin']), reply.edit
app.put '/thread/:tid/reply/:id', mw.isUser, mw.restrictToRoles(['mod', 'admin']), reply.update

# Server Startup

app.listen process.env.PORT or 3000
console.log "Express server listening on port %d in %s mode", app.address().port, app.settings.env


