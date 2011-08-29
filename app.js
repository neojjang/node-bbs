(function() {
  var app, db, express, mw, reply, session, site, thread, user;
  express = require('express');
  mw = require('./lib/middleware');
  db = require('./lib/db');
  site = require('./lib/site');
  user = require('./lib/user');
  reply = require('./lib/reply');
  thread = require('./lib/thread');
  session = require('./lib/session');
  app = module.exports = express.createServer();
  app.configure(function() {
    var secret;
    secret = '30d8689332f7091b0b868926502bf690';
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.session({
      secret: secret
    }));
    app.use(require('stylus').middleware({
      src: __dirname + '/public'
    }));
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
  });
  app.configure('development', function() {
    app.use(express.static(__dirname + '/public'));
    app.use(express.errorHandler({
      dumpExceptions: true,
      showStack: true
    }));
  });
  app.configure('production', function() {
    var oneYear;
    oneYear = 31557600000;
    app.use(express.static(__dirname + '/public', {
      maxAge: oneYear
    }));
    app.use(express.errorHandler);
  });
  app.dynamicHelpers({
    session: function(req, res) {
      return req.session;
    },
    flash: function(req, res) {
      return req.flash();
    },
    url: function(req, res) {
      return req.url;
    },
    isUser: function(req, res) {
      if (req.session.user) {
        return true;
      }
    },
    isAdmin: function(req, res) {
      if (req.session.user && (req.session.user.role === 'admin')) {
        return true;
      }
    },
    isMod: function(req, res) {
      if (req.session.user && (req.session.user.role === 'mod')) {
        return true;
      }
    }
  });
  app.get('/', site.index);
  app.get('/login', session["new"]);
  app.post('/login', session.create);
  app.get('/logout', session.destroy);
  app.get('/users', user.index);
  app.get('/register', user["new"]);
  app.post('/register', user.create);
  app.get('/user/:id', user.show);
  app.get('/user/:id/edit', mw.isUser, mw.isSelf, user.edit);
  app.put('/user/:id', mw.isUser, mw.isSelf, user.update);
  app.get('/threads', thread.index);
  app.get('/threads/new', mw.isUser, thread["new"]);
  app.post('/threads', mw.isUser, thread.create);
  app.get('/thread/:id', thread.show);
  app.get('/thread/:id/edit', mw.isUser, mw.restrictToRoles(['mod', 'admin']), thread.edit);
  app.put('/thread/:id', mw.isUser, mw.restrictToRoles(['mod', 'admin']), thread.update);
  app.get('/thread/:id/delete', mw.isUser, mw.restrictToRoles(['mod', 'admin']), thread.destroy);
  app.post('/thread/:tid/replies', mw.isUser, reply.create);
  app.get('/thread/:tid/reply/:id/edit', mw.isUser, mw.restrictToRoles(['mod', 'admin']), reply.edit);
  app.put('/thread/:tid/reply/:id', mw.isUser, mw.restrictToRoles(['mod', 'admin']), reply.update);
  app.listen(process.env.PORT || 3000);
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
}).call(this);
