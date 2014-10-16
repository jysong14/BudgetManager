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

	draw_default_main();

	var current_date = new Date();
	var current_month = current_date.getMonth()+1;
	var current_year = current_date.getFullYear();
	print_days(current_year, current_month);

	function print_days(year, month){
		var days = new Date(year, month, 0).getDate();
		var date_container = document.getElementById("day_body");
		var row = date_container.insertRow();
		for(i=1; i<days+1; i++){
			row.insertCell().innerHTML = "<input class='day_check_button' id=" + i + " type='checkbox' name='day_check_button' value=" + i + " />" + "<label for=" + i + ">" + i + "</label>";
			if(i%5 == 0){
				row = date_container.insertRow();
			}
		}
	}

	$(".month_check_button").change(function(){
		$(".month_check_button").not(this).prop("checked", false);
		var year = $(".year_check_button:checked").val();
		var month = $(".month_check_button:checked").val();
		$("#day_body").empty();
		print_days(year, month);
	});

	$(".day_check_button").change(function(){
		$(".day_check_button").not(this).prop("checked", false);
	});

	$("input[name='card_check_button']:first").prop("checked", true);

	$("input[name='month_check_button'][value='" + current_month + "']").prop("checked", true);

	$("#menu_submit").click(function(){
		main_data_handler();
	});

	function draw_default_main(){
		var curDate = new Date();
		var curMonth = curDate.getMonth()+1;
		var curYear = curDate.getFullYear();
		var first_card = $("input[name='card_check_button']:first").val();
		var post_data = {'date_type': 'month', 'month_value': curMonth, 'year_value': curYear, 'card': first_card};

		$.ajax({
			type:'POST',
			url: 'http://localhost:8000/budget_manager/main/pull',
			data: post_data,
			dataType:'json',
			success: function(data){
				make_table(data.table_data);
				draw_pie_chart(data.pie_data);
				draw_line_graph(data.line_data);
			}
		});
	}

	function main_data_handler(){
		var year_value = $('input[name="year_check_button"]:checked').val();

		var month_values = new Array();
		$('input[name="month_check_button"]:checkbox:checked').each(function(){
			month_values.push($(this).val());
		});

		var day_values = new Array();
		$('input[name="day_check_button"]:checkbox:checked').each(function(){
			day_values.push($(this).val());
		});

		var card = $('input[name="card_check_button"]:checked').val();

		if((day_values.length != 0) && (month_values.length != 0)){
			var date_type = 'day';
			var post_data = {'date_type': date_type, 'day_value': day_values[0], 'month_value': month_values[0], 'year_value': year_value, 'card': card};
		}else if(month_values.length != 0){
			var date_type = 'month';
			var post_data = {'date_type': date_type, 'month_value': month_values[0], 'year_value': year_value, 'card': card};
		}else{
			var date_type = 'year';
			var post_data = {'date_type': date_type, 'year_value': year_value, 'card': card};
		}
		$.ajax({
			type:'POST',
			url:'http://localhost:8000/budget_manager/main/pull',
			data: post_data,
			dataType:'json',
			success: function(data){
				make_table(data.table_data);
				draw_pie_chart(data.pie_data);
				draw_line_graph(data.line_data);
			}
		});
	}

});