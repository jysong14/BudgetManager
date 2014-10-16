$(document).ready(function(){

	var csrftoken = $.cookie('csrftoken');
	function csrfSafeMethod(method) {
	    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
	}
	$.ajaxSetup({
	    beforeSend: function(xhr, settings) {
	        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
	            xhr.setRequestHeader("X-CSRFToken", csrftoken);
	        }
	    }
	});

	$('#insert_entry').dialog({
		autoOpen: false,
		modal: true,
		title: 'Insert Entry',
		width: 200,
		position:{
			my: "center",
			at: "center",
			of: "#input"
		},
		buttons:[
			{
				text: "Submit",
				"class": "dialog_button btn",
				click: function(){
					calendar_clear_error();
					var card = $('#card').val();
					var amount = $('#amount').val();
					var description = $('#description').val();
					var category = $('#spending_categories').val();
					var date = document.getElementById('entry_date').textContent;

					if(calendar_check_error(card, category, amount, description) == true){
						$.ajax({
							type: 'POST',
							url: 'http://localhost:8000/budget_manager/calendar/',
							data: {
								'card': card,
								'category': category, 
								'description': description, 
								'amount': amount, 
								'date': date},
							success: function(data){
								$('#msg_container').text(data);
							},
							error: function(){
								$('#msg_container').text('Error Occured During Insertion!');
							}
						});
						$(this).dialog('close');
					}
				}
			},
			{
				text: "Cancel",
				"class": "dialog_button btn",
				click: function(){
					$(this).dialog('close');
				}
			}
		],
		close: function(){
			reset();
		}
	});

	function reset(){
		var entry_date = document.getElementById('entry_date');
		entry_date.removeChild(entry_date.childNodes[0]);
		$('#description').val('');
		$('#amount').val('');
		$('#first_cagetory').attr('selected', true);
		$('#default_card').attr('selected', true);
		calendar_clear_error();
	}
	
});
