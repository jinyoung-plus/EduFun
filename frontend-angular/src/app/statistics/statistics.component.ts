//statistics.component.ts
import { Component, OnInit } from '@angular/core';
import { formatDate } from '../utils';
import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
import { ApiService } from '../api.service';

HC_exporting(Highcharts);

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})

export class StatisticsComponent implements OnInit {
  currentWeekStart: Date;
  currentWeekEnd!: Date;
  Highcharts = Highcharts;
  chart: any; // This will store the chart instance
  updateFlag = false; // This flag is used to trigger chart update
  chartOptions: Highcharts.Options = {
    chart: {
      type: 'column'
    },
    title: {
      text: 'Weekly Study Data',
      style: {
        fontSize: '25px'
      }
    },
    xAxis: {
      title: {
        text: 'Day of the Week',
        style: {
          fontSize: '20px'
        }
      },
      labels: {
        style: {
          fontSize: '16px' // 여기서 폰트 크기를 조절하세요.
        }
      }
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Hours Studied',
        style: {
          fontSize: '20px'
        }
      },
      stackLabels: {
        enabled: true,
        style: {
          fontWeight: 'bold',
          color: 'gray'
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
          enabled: true
        }
      }
    },
    series: [
      {
        type: 'column',
        name: 'Study Hours',
        data: [], // Placeholder for the actual data
        color: '#FFA500'
      }
    ]
  }

  constructor(private apiService: ApiService) {
    // Set the currentWeekStart to the most recent Monday
    this.currentWeekStart = this.getMostRecentMonday(new Date());
  }

  ngOnInit() {
    // 현재 주의 시작을 가장 최근의 일요일로 초기화합니다 (UTC 기준).
    this.currentWeekStart = this.getMostRecentSunday(new Date());
    // 현재 주의 끝을 계산합니다 (토요일, UTC 기준).
    this.currentWeekEnd = new Date(Date.UTC(this.currentWeekStart.getUTCFullYear(), this.currentWeekStart.getUTCMonth(), this.currentWeekStart.getUTCDate()));
    this.currentWeekEnd.setUTCDate(this.currentWeekEnd.getUTCDate() + 6);

    // 현재 주에 대한 주간 학습 데이터를 로드합니다.
    this.loadWeeklyStudyData(this.currentWeekStart, this.currentWeekEnd);
  }

  // This method returns true if the currentWeekStart is this week
  isCurrentWeek(): boolean {
    const now = new Date();
    const thisMonday = this.getMostRecentMonday(now);
    return thisMonday <= this.currentWeekStart && this.currentWeekStart <= now;
  }

  // 이 함수는 UTC 날짜로 카테고리를 생성합니다.
  generateCategories(startDate: Date, endDate: Date): string[] {
    const categories = [];
    let currentDate = new Date(Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate()));
    const end = new Date(Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate()));

    while (currentDate <= end) {
      categories.push(formatDate(currentDate)); // 'YYYY-MM-DD' 형식으로 날짜를 포맷합니다.
      currentDate = new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate() + 1));
    }

    return categories;
  }

  loadWeeklyStudyData(startDate: Date, endDate: Date) {
    this.apiService.getWeeklyStudyData(startDate, endDate).subscribe(data => {

      // Generate categories based on the startDate and endDate
      const categories = this.generateCategories(startDate, endDate);
      for (let d = new Date(startDate); d <= endDate; d = new Date(d.setDate(d.getDate() + 1))) {
        categories.push(formatDate(new Date(d))); // Format date as 'YYYY-MM-DD'
      }

      // Safely update the chart options
      if (this.chartOptions.xAxis && this.chartOptions.series && this.chartOptions.series[0]) {
        const xAxis = this.chartOptions.xAxis as Highcharts.XAxisOptions;
        const series = this.chartOptions.series[0] as Highcharts.SeriesColumnOptions;

        xAxis.categories = categories;
        series.data = data.map((minutes: number) => ({
          y: parseFloat((minutes / 60).toFixed(2)), // Convert minutes to hours and format to 2 decimal places
        }));

        this.chartOptions.xAxis = xAxis;
        this.chartOptions.series[0] = series;
      }

      // Trigger the chart update
      if (this.chart) {
        this.chart.update({
          xAxis: {
            categories: categories
          },
          series: [{
            data: data.map((minutes: number) => ({
              y: parseFloat((minutes / 60).toFixed(2)),
              dataLabels: {
                enabled: false
              }
            }))
          }]
        });


      } else {
        this.updateFlag = true; // if using Highcharts Angular wrapper and the chart is not initialized yet
      }
    }, error => {
      // 에러 처리 로직 추가
      console.error("Failed to load data:", error);
      alert("Failed to load weekly study data.");
    });
  }
  // Call this method when the user wants to see the previous week's data
  loadPreviousWeek() {
    // Subtract 7 days to move to the start of the previous week
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() - 7);
    // Calculate the end date of the previous week
    this.currentWeekEnd = new Date(this.currentWeekStart);
    this.currentWeekEnd.setDate(this.currentWeekEnd.getDate() + 6);

    // Load the weekly study data for the previous week
    this.loadWeeklyStudyData(this.currentWeekStart, this.currentWeekEnd);
  }

   // 이 함수는 현재 날짜의 가장 최근 일요일을 UTC 기준으로 반환합니다.
  getMostRecentSunday(currentDate: Date): Date {
    const date = new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate()));
    const day = date.getUTCDay();
    const difference = day === 0 ? 0 : -day; // 일요일이면 변화 없음, 그렇지 않으면 일요일까지의 날짜 차이를 빼줍니다.
    date.setUTCDate(date.getUTCDate() + difference);
    return date;
  }

  loadNextWeek() {
    // Calculate the end of the current week based on today's date
    const now = new Date();
    const dayOfWeek = now.getDay();
    const endOfThisWeek = new Date(now);
    endOfThisWeek.setDate(now.getDate() + (6 - dayOfWeek)); // Adjust to get the end of the week, which is Sunday

    // Convert both dates to start of the day for a proper comparison
    endOfThisWeek.setHours(0, 0, 0, 0);
    const currentWeekEndDate = new Date(this.currentWeekEnd);
    currentWeekEndDate.setHours(0, 0, 0, 0);

    // Check if we're already showing the most recent week
    if (currentWeekEndDate >= endOfThisWeek) {
      alert("This is the most recent study data.");
      return;
    }

    // Proceed to load the next week
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() + 7);
    this.currentWeekEnd = new Date(this.currentWeekStart);
    this.currentWeekEnd.setDate(this.currentWeekEnd.getDate() + 6);

    // Load the weekly study data for the next week
    this.loadWeeklyStudyData(this.currentWeekStart, this.currentWeekEnd);
  }


  // Helper method to find the most recent Monday
  getMostRecentMonday(currentDate: Date): Date {
    const date = new Date(currentDate);
    const day = date.getDay();
    const difference = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    date.setDate(difference);
    // Set the hours to the start of the day
    date.setHours(0, 0, 0, 0);
    return date;
  }

  // Use this function to capture the chart instance after Highcharts initializes it
  saveInstance(chartInstance: any) {
    this.chart = chartInstance;
    //console.log('!!!! Chart instance saved:', this.chart); // Log to check the chart instance
  }
}

