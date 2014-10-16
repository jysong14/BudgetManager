function draw_pie_chart(pieChart_data){
   $('#piechart').highcharts({
        credits:{
            enabled: false
        },
        chart:{
            borderRadius: 5
        },
        title: {
            text: 'Categories Spendings',
            style:{
                color: '#0099CC',
                fontSize: '25px',
                fontFamily: '"Comic Sans MS"',
                fontWeight: 'bold',               
            }
        },
        tooltip: {
            borderWidth: 3,
            headerFormat: '<span style="font-size: 15px;">{point.key}</span><br/>',
            pointFormat: '{series.name}: <b>${point.y:.2f}</b>',
            style: {
            	color: '#0099CC',
                fontFamily: '"Comic Sans MS"',
                fontWeight: 'bold',
                fontSize: '13px'                        
            }
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                borderWidth: 2,
                cursor: 'pointer',
                colors: ['#C41A2B', '#CC7212', '#E0D83F', '#3CB835', '#1BDEBA', '#3410E6', '#A334ED'],
                dataLabels: {
                    connectorWidth: 2,
                    style: {
                        color: '#0099CC',
                        fontFamily: '"Comic Sans MS"',
                        fontWeight: 'bold',
                        fontSize: '13px'
                    }
                },
                showInLegend: true,
                states: {
                	hover: {
                		halo: {
                			opacity: 0.7
                		}
                	}
                }
            }
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
        series: [{
            type: 'pie',
            name: 'Spendings',
            colors: ['#C41A2B', '#CC7212', '#E0D83F', '#3CB835', '#1BDEBA', '#3410E6', '#A334ED'],
            data: pieChart_data
        }]
                    
    });
};    
