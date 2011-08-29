(function() {
  exports.isUser = function(req, res, next) {
    if (req.session.user) {
      next();
    } else {
      req.flash('warn', 'You need to be logged in to do that.');
      res.redirect('/login?redir=' + req.url);
    }
  };
  exports.isSelf = function(req, res, next) {
    if (req.params.id === req.session.user._id) {
      next();
    } else {
      req.flash('warn', 'You do not have permission to do that.');
      res.redirect('/');
    }
  };
  exports.restrictToRoles = function(roles) {
    return function(req, res, next) {
      var role, _i, _len;
      for (_i = 0, _len = roles.length; _i < _len; _i++) {
        role = roles[_i];
        if (req.session.user.role === role) {
          next();
          return;
        }
      }
      req.flash('warn', 'You do not have permission to do that.');
      res.redirect('/');
    };
  };
}).call(this);
