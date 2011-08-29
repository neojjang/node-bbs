(function() {
  var db;
  db = require('./db');
  exports.index = function(req, res) {
    return db.User.find({}, function(err, users) {
      if (err) {
        throw err;
      }
      return res.render('users', {
        title: 'Users',
        users: users
      });
    });
  };
  exports["new"] = function(req, res) {
    return res.render('users/new', {
      title: 'Registration',
      user: {
        name: '',
        email: ''
      }
    });
  };
  exports.create = function(req, res) {
    var user;
    user = new db.User(req.body.user);
    return user.save(function(err) {
      if (err) {
        throw err;
      }
      req.flash('info', 'User created sucessfully, now please login.');
      return res.redirect('/login');
    });
  };
  exports.show = function(req, res) {
    return db.User.findById(req.params.id, function(err, user) {
      if (err) {
        throw err;
      }
      return res.render('users/single', {
        title: user.name,
        user: user
      });
    });
  };
  exports.edit = function(req, res) {
    return db.User.findById(req.params.id, function(err, user) {
      if (err) {
        throw err;
      }
      return res.render('users/edit', {
        title: 'Edit User ' + user.name,
        user: user
      });
    });
  };
  exports.update = function(req, res) {
    return db.User.update({
      _id: req.params.id
    }, req.body.user, function() {
      req.session.user.name = req.body.user.name;
      return res.redirect('/user/' + req.params.id);
    });
  };
}).call(this);
