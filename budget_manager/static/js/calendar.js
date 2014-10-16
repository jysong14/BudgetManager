$(document).ready(function(){

	$('#datepicker').datepicker({
		buttonImage: 'button',
		firstDay: 0,
		showOtherMonths: true,

		onSelect: function(date, event){
			var selected_date = date;
			event.inline = false;
			var entry_date = document.getElementById('entry_date');
			var date_to_show = document.createTextNode(selected_date);
			entry_date.appendChild(date_to_show);
			$('#insert_entry').dialog('open');
		},

		onChangeMonthYear: function(){
		    setTimeout(function(){
		        mouseHover();
		    }, 0);
		}

	});

	mouseHover();

	function mouseHover(){
		$('.ui-datepicker-calendar td').mouseenter(function(){
				$(this).addClass('hover_border');
			}).mouseleave(function(){
				$(this).removeClass('hover_border');	
		});
	}

});
