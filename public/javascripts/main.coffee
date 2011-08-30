
prettyDate = (time) ->
	date = new Date(Date.parse(time))
	diff = (((new Date()).getTime() - date.getTime()) / 1000)
	day_diff = Math.floor(diff / 86400)
	return  if isNaN(day_diff) or day_diff < 0 or day_diff >= 31
	day_diff == 0 and (diff < 60 and "just now" or diff < 120 and "1 minute ago" or diff < 3600 and Math.floor(diff / 60) + " minutes ago" or diff < 7200 and "1 hour ago" or diff < 86400 and Math.floor(diff / 3600) + " hours ago") or day_diff == 1 and "Yesterday" or day_diff < 7 and day_diff + " days ago" or day_diff < 31 and Math.ceil(day_diff / 7) + " weeks ago"
unless typeof jQuery == "undefined"
	jQuery.fn.prettyDate = ->
		@each ->
			date = prettyDate($(this).attr("date"))
			$(this).text date  if date
			return




$( () ->
	$('.date').prettyDate()
	
	$('.closebox').click () ->
		$(this).parent().slideUp () ->
			$(this).remove()
			return
		return
	
	
	
	setInterval () ->
		$('.date').prettyDate()
		return
	, 10000
	
	return
)

