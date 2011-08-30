(function() {
  var db;
  db = require('./db');
  exports["new"] = function(req, res) {
    return res.render('sessions/new', {
      title: 'Login',
      redir: req.query.redir
    });
  };
  exports.create = function(req, res) {
    return db.User.findOne({
      name: req.body.name
    }, function(err, user) {
      if (err) {
        throw err;
      }
      if (user) {
        return db.User.update({
          _id: user._id
        }, {
          $inc: {
            logins: 1
          },
          lastLogin: Date.now()
        }, function(err) {
          if (err) {
            throw err;
          }
          req.session.user = user;
          req.flash('info', 'Welcome back, ' + user.name + '.');
          return res.redirect(req.body.redir || '/');
        });
      } else {
        req.flash('warn', 'Login Failed.');
        return res.render('sessions/new', {
          title: 'Login',
          redir: req.query.redir
        });
      }
    });
  };
  exports.destroy = function(req, res) {
    delete req.session.user;
    return res.redirect('/login');
  };
}).call(this);
