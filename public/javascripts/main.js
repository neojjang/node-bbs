(function() {
  var prettyDate;
  prettyDate = function(time) {
    var date, day_diff, diff;
    date = new Date(Date.parse(time));
    diff = ((new Date()).getTime() - date.getTime()) / 1000;
    day_diff = Math.floor(diff / 86400);
    if (isNaN(day_diff) || day_diff < 0 || day_diff >= 31) {
      return;
    }
    return day_diff === 0 && (diff < 60 && "just now" || diff < 120 && "1 minute ago" || diff < 3600 && Math.floor(diff / 60) + " minutes ago" || diff < 7200 && "1 hour ago" || diff < 86400 && Math.floor(diff / 3600) + " hours ago") || day_diff === 1 && "Yesterday" || day_diff < 7 && day_diff + " days ago" || day_diff < 31 && Math.ceil(day_diff / 7) + " weeks ago";
  };
  if (typeof jQuery !== "undefined") {
    jQuery.fn.prettyDate = function() {
      return this.each(function() {
        var date;
        date = prettyDate($(this).attr("date"));
        if (date) {
          $(this).text(date);
        }
      });
    };
  }
  $(function() {
    $('.date').prettyDate();
    $('.closebox').click(function() {
      $(this).parent().slideUp(function() {
        $(this).remove();
      });
    });
    setInterval(function() {
      $('.date').prettyDate();
    }, 10000);
  });
}).call(this);
