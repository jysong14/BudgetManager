function make_table(table_data){
	var budget_table = document.getElementById('budget_table_body');
	budget_table.innerHTML='';

	for(i=0; i<table_data.length; i++){
		var row = budget_table.insertRow();
		for(j=0; j<table_data[i].length; j++){
			row.insertCell().innerHTML = table_data[i][j];
		}
		row.cells[4].style.display = 'none';
		row.cells[5].style.display = 'none';
		row.insertCell().innerHTML = '<button class="delete_button btn btn-primary" type="button">Delete</button>';
		row.cells[6].style.border = 0;
	}

	delete_buttons();

};

function delete_buttons(){
	var delete_buttons = document.getElementsByClassName('delete_button');
	for(j=0; j<delete_buttons.length; j++){
		delete_buttons[j].addEventListener('click', function(){
			var del_row = $(this).closest('tr').find('td');
			var date = del_row[0].innerHTML;
			var category = del_row[1].innerHTML;
			var description = del_row[2].innerHTML;
			var price = del_row[3].innerHTML;
			var bid = del_row[4].innerHTML;
			var cid = del_row[5].innerHTML;
			delete_entry(date, category, description, price, bid, cid);
			update_display(this, date, category, price);
		}, false);
	}
}

function delete_entry(date, category, description, price, bid, cid){
	var post_data = {'date': date, 'category': category, 'description': description, 'price': price, 'bid': bid, 'cid': cid}
	$.ajax({
		type:'POST',
		url:'http://localhost:8000/budget_manager/main/delete',
		data: post_data
	});
}

function update_display(del_obj, date, category, price){
	/*delete table row*/
	$(del_obj).closest('tr').remove();

	/*delete piechart entries*/
	var pie_data = $('#piechart').highcharts().series[0].data;
	var pie_data_array = new Array();

	for(i=0; i<pie_data.length; i++){
		if(pie_data[i].name != category){
			pie_data_array.push([pie_data[i].name, pie_data[i].y]);
		}else if(pie_data[i].y-price != 0){
				pie_data_array.push([pie_data[i].name, pie_data[i].y-price]);
		}
	}

	$('#piechart').highcharts().series[0].update({
		data: pie_data_array
	});

	/*delete linegraph entries*/
	var line_data = $('#linegraph').highcharts();
	var del_date = date_parser(date);
	var new_data = new Array();

	for(j=0; j<line_data.series.length; j++){
		if(category == line_data.series[j].name){
			for(k=0; k<line_data.series[j].xData.length; k++){
				if(line_data.series[j].xData[k] != del_date){
					new_data.push([line_data.series[j].xData[k], line_data.series[j].yData[k]]);
				}else{
					if(line_data.series[j].yData[k]-price != 0){
						new_data.push([line_data.series[j].xData[k], line_data.series[j].yData[k]-price]);
					}
				}
			}
			if(new_data.length == 0){
				line_data.series[j].remove();
				j--;
			}
			else{
				line_data.series[j].update({
					data: new_data
				});
			}
		}
	}

}