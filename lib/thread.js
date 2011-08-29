(function() {
  var db;
  db = require('./db');
  exports.index = function(req, res) {
    return db.Thread.find({}, function(err, threads) {
      if (err) {
        throw err;
      }
      return res.render('threads', {
        title: 'Threads',
        threads: threads
      });
    });
  };
  exports["new"] = function(req, res) {
    return res.render('threads/new', {
      title: 'New Thread',
      thread: {
        title: '',
        body: ''
      }
    });
  };
  exports.create = function(req, res) {
    var thread;
    thread = new db.Thread({
      title: req.body.thread.title,
      uid: req.session.user._id,
      uname: req.session.user.name,
      body: req.body.thread.body
    });
    return thread.save(function(err) {
      if (err) {
        throw err;
      }
      return db.User.update({
        _id: req.session.user._id
      }, {
        $inc: {
          threads: 1
        }
      }, function(err) {
        if (err) {
          throw err;
        }
        return res.redirect('/threads');
      });
    });
  };
  exports.show = function(req, res) {
    return db.Thread.findById(req.params.id, function(err, thread) {
      if (err) {
        throw err;
      }
      return res.render('threads/show', {
        title: thread.title,
        thread: thread
      });
    });
  };
  exports.edit = function(req, res) {
    return db.Thread.findById(req.params.id, function(err, thread) {
      if (err) {
        throw err;
      }
      return res.render('threads/edit', {
        title: 'Edit Thread ' + thread.title,
        thread: thread
      });
    });
  };
  exports.update = function(req, res) {
    return db.Thread.update({
      _id: req.params.id
    }, req.body.thread, function() {
      return res.redirect('/thread/' + req.params.id);
    });
  };
  exports.destroy = function(req, res) {
    return db.Thread.remove({
      _id: req.params.id
    }, function(err) {
      if (err) {
        throw err;
      }
      return res.redirect('/threads');
    });
  };
  exports.newReply = function(req, res) {
    return db.Thread.findById(req.params.id, function(err, thread) {
      if (err) {
        throw err;
      }
      thread.replies.push({
        uid: req.session.user._id,
        uname: req.session.user.name,
        body: req.body.reply
      });
      return thread.save(function(err) {
        if (err) {
          throw err;
        }
        return db.User.update({
          _id: req.session.user._id
        }, {
          $inc: {
            replies: 1
          }
        }, function(err) {
          if (err) {
            throw err;
          }
          return res.redirect('/thread/' + thread._id);
        });
      });
    });
  };
}).call(this);
