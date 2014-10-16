function draw_line_graph(lineGraph_data){
	$('#linegraph').highcharts({
		chart:{
			type: 'column',
			borderRadius: 5
		},
		credits: {
			enabled: false
		},
		colors: ['#C41A2B', '#CC7212', '#E0D83F', '#3CB835', '#1BDEBA', '#3410E6', '#A334ED'],
		title: {
			text: 'Budget Statistics',
			style:{
                color: '#0099CC',
                fontSize: '25px',
                fontFamily: '"Comic Sans MS"',
                fontWeight: 'bold'                        
            }
		},
		tooltip: {
			borderWidth: 3,
			borderColor: '#0099CC',
			headerFormat: '<span style="font-size: 15px">{point.key}</span><br/>',
			pointFormat: '<span style="color:{series.color}">{series.name}: <b>${point.y:.2f}</b></span><br/>',
			style: {
	        	color: '#0099CC', 
	            fontFamily: '"Comic Sans MS"',
	            fontWeight: 'bold',
	            fontSize: '13px'                        
            },
            shared: true,
            xDateFormat: '%m/%d/%Y'
		},
		legend: {
			borderWidth: 3,
			borderColor: '#0099CC',
			borderRadius: 5,
			itemStyle: {
	        	color: '#0099CC',
	            fontFamily: '"Comic Sans MS"',
	            fontSize: '13px'                        
	        },
	        itemHoverStyle: {
	        	color: '#211D8C'
	        }
		},
		plotOptions: {
			column:{
				pointRange: 24 * 3600 * 1000
			}
		},
		xAxis: {
			type: "datetime",
			dateTimeLabelFormats: { day: '%m/%d', week: '%m/%d', month: '%m/%Y', year: '%Y' },
			title:{
				text: "Dates",
				style:{
					color: '#0099CC',
					fontFamily: '"Comic Sans MS"',
	            	fontSize: '13px',
	            	fontWeight: 'bold'
				}
			},
			labels: {
				style: {
					color: '#0099CC',
					fontFamily: '"Comic Sans MS"',
	            	fontSize: '10px'
				}
			},
			lineColor: '#0099CC'
		},
		yAxis: {
			title:{
				text: "Spendings (Dollars)",
				style:{
					color: '#0099CC',
					fontFamily: '"Comic Sans MS"',					
	            	fontSize: '13px',
	            	fontWeight: 'bold'
				}
			},
			floor: 0,
			gridLineColor: '#0099CC',
			labels: {
				style: {
					color: '#0099CC',
					fontFamily: '"Comic Sans MS"',
	            	fontSize: '10px'
				}
			}
		}
	});

	add_series_data(lineGraph_data);

};

function date_parser(date){
	var split_date = date.split("/");
	var parsed_date = Date.UTC(split_date[2], split_date[0]-1, split_date[1]);
	return parsed_date;
}

function add_series_data(line_data){
	var line_graph = $('#linegraph').highcharts();
	var keys = Object.keys(line_data);
	var keys_length = keys.length;
	var attr_string = ''; 
	var parsed_string = new Object();

	for(i=0; i<keys_length; i++){
		attr_string += '{"name": "' + keys[i] + '", ' + '"data": [';
		for(j=0; j<line_data[keys[i]].length; j++){
			attr_string += '[' + date_parser(line_data[keys[i]][j][0]) + ',' + line_data[keys[i]][j][1] + ']';
			if(j != line_data[keys[i]].length-1){
				attr_string += ',';
			}
		}
		attr_string += ']}';
		parsed_string = JSON.parse(attr_string);
		line_graph.addSeries(parsed_string);
		attr_string = "";
	}
}