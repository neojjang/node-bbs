(function() {
  exports.index = function(req, res) {
    return res.render('index', {
      title: 'Home'
    });
  };
}).call(this);
