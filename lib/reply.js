(function() {
  var db;
  db = require('./db');
  exports.create = function(req, res) {
    return db.Thread.findById(req.params.tid, function(err, thread) {
      if (err) {
        throw err;
      }
      thread.replies.push({
        id: thread.repliesnum + 1,
        uid: req.session.user._id,
        uname: req.session.user.name,
        body: req.body.reply
      });
      return thread.save(function(err) {
        if (err) {
          throw err;
        }
        return db.Thread.update({
          _id: thread._id
        }, {
          $inc: {
            repliesnum: 1
          }
        }, function(err) {
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
    });
  };
  exports.edit = function(req, res) {
    return db.Thread.findById(req.params.tid, function(err, thread) {
      if (err) {
        throw err;
      }
      return res.render('replies/edit', {
        title: 'Edit Reply',
        thread: thread,
        reply: thread.replies.id(req.params.id)
      });
    });
  };
  exports.update = function(req, res) {
    return db.Thread.findById(req.params.tid, function(err, thread) {
      var reply;
      if (err) {
        throw err;
      }
      reply = thread.replies.id(req.params.id);
      reply.body = req.body.reply.body;
      return res.render('replies/edit', {
        title: 'Edit Reply',
        thread: thread,
        reply: thread.replies.id(req.params.id)
      });
    });
  };
}).call(this);
