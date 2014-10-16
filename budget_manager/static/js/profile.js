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

	$('input[name="card_type"]').on('change', function(){
		if($('input[name="card_type"]:checked').val() == 'Debit'){
			$('#card_balance_form').show();
		}else{
			$('#card_balance_form').hide();
		}
	})

	$(document).on('click', '.delete_button', function(){
		var del_row = $(this).closest('tr');
		var card_number = del_row.find('td')[0].innerHTML;
		var card_type = del_row.find('td')[1].innerHTML;
		var post_data = {'card_number': card_number};
		$.ajax({
			type: 'POST',
			url: 'http://localhost:8000/budget_manager/profile/delete_card',
			data: post_data,
			success: function(data){
				del_row.remove();
				if(card_type == 'Debit'){
					$('#add_balance_card option[value="'+ card_number +'"]').remove();
				}
				$("#msg_container").text(data);
			},
			error: function(data){
				$("#msg_container").text(data);
			}
		})
	});

	$('.ac').click(function(){
		$('#add_balance').hide();
		$('#add_card').show();
	});

	$('.ab').click(function(){
		$('#add_card').hide();
		$('#add_balance').show();
	});

	$('.wd').click(function(){
		
	});

	$('#add_balance_submit').click(function(){
		var card = $('#add_balance_card').val();
		var balance = $('#add_balance_amount').val();
		var post_data = {'card': card, 'balance': balance};
		$.ajax({
			type: 'POST',
			url: 'http://localhost:8000/budget_manager/profile/add_balance',
			data: post_data,
			success: function(data){
				add_balance(card, balance);
				add_balance_reset();
				$("#msg_container").text(data);
			},
			error: function(data){
				$("#msg_container").text(data);
			}
		})
	});

	$('#add_card_submit').click(function(){
		var card = $('#card_number').val();
		var balance = $('#card_balance').val();
		var type = $('input[name="card_type"]:checked').val();
		var post_data = {'card_number': card, 'card_balance': balance, 'card_type': type};
		$.ajax({
			type: 'POST',
			url: 'http://localhost:8000/budget_manager/profile/add_card',
			data: post_data,
			success: function(data){
				if(data !== 'Card Already Exists!'){
					add_card(card, type, balance);
				}
				add_card_reset();
				$("#msg_container").text(data);
			},
			error: function(data){
				$("#msg_container").text(data);
			}
		})
	});

	function add_card(number, type, balance){
		var card_table = document.getElementById('card_table_body');
		var row = card_table.insertRow();
		row.insertCell().innerHTML = number;
		row.insertCell().innerHTML = type;
		if(!balance){
			row.insertCell().innerHTML = 'None';
		}else{
			row.insertCell().innerHTML = balance;
		}
		var del_button = row.insertCell();
		del_button.setAttribute('class', 'delete_button_td');
		del_button.innerHTML = '<button type="button" class="delete_button btn" value="' + number +'">Delete</button>';
		if(type == 'Debit'){
			$('#add_balance_card').append('<option value="' + number + '"">' + number +'</option>');
		}
	}

	function add_balance(number, balance){
		$('tr').each(function(){
			var card = $(this).find('td:eq(0)').text();
			if(card == number){
				var target = $(this).find('td:eq(2)');
				var amount = parseFloat(target.text()) + parseFloat(balance);
				target.text(amount);
				return;
			}
		})
	}

	function add_card_reset(){
		$('#card_number').val('');
		$('#card_balance').val('');
		$('input[name="card_type"][value="Credit"]').prop('checked', true);
		$('#card_balance_form').hide();
	}

	function add_balance_reset(){
		$('#default_card').prop('selected', true);
		$('#add_balance_amount').val('');
	}

})