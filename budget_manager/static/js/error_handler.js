function main_check_month(){
	if($('input.month_check_button:radio:checked').val() == null){
		$('#month_error').show();
		return false;
	}else{
		return true;
	}
}

function main_check_year(){
	if($('input.year_check_button:radio:checked').val() == null){
		$('.year_error').show();
	}else{
		return true;
	}
}

function main_clear_error(){
	$('#month_error').hide();
	$('.year_error').hide();
}

function calendar_check_error(card, category, amount, description){
	if(calendar_check_card_category(card, category, amount, description) == true){
		var amount_ok = calendar_check_amount(amount);
		var description_ok = calendar_check_description(description);
		if(amount_ok == true && description_ok == true){
			return true;
		}
		else{
			return false;
		}
	}else{
		return false;
	}
}

function calendar_check_card_category(card, category, amount, description){
	if(card == ''){
		$('#card_error').show();
		if(category == ''){
			$('#category_error').show();
			calendar_check_amount(amount);
			calendar_check_description(description);
			return false;
		}else{
			calendar_check_amount(amount);
			calendar_check_description(description);
			return false;
		}
	}else{
		if(category == ''){
			$('#category_error').show();
			calendar_check_amount(amount);
			calendar_check_description(description);
			return false;
		}else{
			return true;
		}
	}
}

function calendar_check_amount(amount){
	if(amount == 0){
		var amount_error = document.getElementById('amount_error');
		amount_error.innerHTML = 'Enter Amount!';
		return false;
	}else if(checkDigit(amount) == false){
			var amount_error = document.getElementById('amount_error');
			amount_error.innerHTML = 'Insert Numbers Only!';
			return false;
	}else{
		return true;
	}
}

function calendar_check_description(description){
	if(description == ''){
		var description_error = document.getElementById('description_error');
		description_error.innerHTML = 'Enter Description!';
		return false;
	}else if(checkSpecialChar(description) == true){
			var description_error = document.getElementById('description_error');
			description_error.innerHTML = 'No Special Characters!';
			return false;
	}else{
		return true;
	}
}

function calendar_clear_error(){
	$('#card_error').hide();
	$('#category_error').hide();
	var amount_error = document.getElementById('amount_error');
	amount_error.innerHTML = '';
	var description_error = document.getElementById('description_error');
	description_error.innerHTML = '';
}

function checkSpecialChar(description){
	/*var specialChar = new RegExp(/[!@#$%^&*()_+-=`~\[\]{}|\\;:\"\'<,>.\/?]/);*/
	var specialChar = new RegExp(/[^a-z0-9]/i);
	return specialChar.test(description);
}

function checkDigit(amount){
	var number = new RegExp(/^(\d+)?(\.\d+)?$/);
	return number.test(amount); 
}