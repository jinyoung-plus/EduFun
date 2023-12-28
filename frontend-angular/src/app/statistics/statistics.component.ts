import { Component } from '@angular/core';
import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';

HC_exporting(Highcharts);

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.css'
})

export class StatisticsComponent {
  Highcharts = Highcharts;

  chartOptions: Highcharts.Options = {
    chart: {
      type: 'column'
    },
    title: {
      text: 'Weekly Study Data',
      style: {
        fontSize: '25px' // Set the font size for the y-axis title
      }
    },
    xAxis: {
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      labels: {
        style: {
          fontSize: '18px' // Set the desired font size for x-axis labels
        }
      },
      title: {
        text: 'Day of the Week',
        style: {
          fontSize: '20px' // Set the font size for the y-axis title
        }
      }
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Hours Studied',
        style: {
          fontSize: '20px' // Set the font size for the y-axis title
        }
      },
      stackLabels: {
        enabled: false,
        style: {
          //fontWeight: 'bold',
          color: 'gray',
          fontSize: '20px' // Bigger text for the Y-axis stack labels
        }
      }
    },
    tooltip: {
      headerFormat: '<b>{point.x}</b><br/>',
      pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
    },
    plotOptions: {
      column: {
        stacking: 'normal',
        dataLabels: {
          enabled: true,
          style: {
            fontSize: '20px' // Bigger text for the data labels
          }
        }
      }
    },
    series: [{
      type: 'column',
      name: 'Study Hours',
      data: [3, 2, 4, 2, 5, 6, 1],
      color: '#FFA500' // Orange color for the bars
    }] as Highcharts.SeriesOptionsType[]
  };
}


