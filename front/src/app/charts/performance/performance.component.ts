import { Component, OnInit } from '@angular/core';
import {DatePipe} from '@angular/common';
import {SocketioService} from '../../services/socketio.service';
import {CrudService} from '../../services/crud.service';
import {API_URL, PERFORMANCE} from '../../globals/global_variables';
import * as math from "mathjs";

@Component({
  selector: 'app-performance',
  templateUrl: './performance.component.html',
  styleUrls: ['./performance.component.scss'],
  providers: [DatePipe]
})
export class PerformanceComponent implements OnInit {




  private allRequests = [];
  private avgLatency = [];
  private errorRate = [];
  private sensors = [];
  private succRequests = [];
  public allRequestsSum =  [0, 0, 0, 0, 0];
  public latencySum =  [0, 0, 0, 0, 0];
  public errorRateSum =  [0, 0, 0, 0, 0];
  public sensorsSum =  [0, 0, 0, 0, 0];
  public succRequestsSum =  [0, 0, 0, 0, 0];
  private labels = [];
  public metrics: any;
  public backgroundColor = [
    'rgba(255, 99, 132, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(255, 206, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(153, 102, 255, 0.2)',
    'rgba(255, 159, 64, 0.2)'
  ];
  public borderColor = [
    'rgba(255,99,132,1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)'
  ]


  requestsData = [{
    label: '# Emit rate',
    data: this.allRequests,
    borderWidth: 1,
    fill: false,
    borderColor: this.borderColor[0],
    backgroundColor: this.backgroundColor[0],
  }, {
    label: '# Throughput',
    data: this.succRequests,
    borderWidth: 1,
    fill: false,
    borderColor: this.borderColor[1],
    backgroundColor: this.backgroundColor[1],
  }
  ];
  latencyData = [{
    label: 'Average latency (ms)',
    data: this.avgLatency,
    borderWidth: 1,
    fill: false
  }];

  errorRateData = [{
    label: 'Error Rate',
    data: this.errorRate,
    borderWidth: 1,
    fill: false
  }];
  sensorsData = [{
    label: '# Number of users',
    data: this.sensors,
    borderWidth: 1,
    fill: false
  }];


  lineChartLabels = this.labels;

  lineChartOptions = {

    scales: {
      xAxes: [{
        display: true,
        scaleLabel: {
          display: true,
          labelString:  'Time',
        }
      }],
      yAxes: [{
        display: true,
        scaleLabel: {
          display: true
        },
        ticks: {
          beginAtZero: true
        }
      }]
    },
    legend: {
      display: true
    },
    elements: {
      point: {
        radius: 0
      }
    }
  };

  lineChartColors = [
    {
      borderColor: 'rgba(255,99,132,1)'
    }
  ];


  constructor(
    private socketioService: SocketioService,
    private datePipe: DatePipe,
    private crudService: CrudService,
  ) { }

  splitData(data) {
    this.labels.push(this.datePipe.transform(data.time, 'hh:mm:ss'))
    this.allRequests.push(data.allRequests)
    this.avgLatency.push(data.avgLatency)
    this.errorRate.push(data.errorRate)
    this.succRequests.push(data.succRequests)
    this.sensors.push(data.sensors)

    this.calculateSummary()

  }

  calculateSummary() {
    this.allRequestsSum[0] = math.mean(this.allRequests)
    this.allRequestsSum[1] = math.variance(this.allRequests)
    this.allRequestsSum[2] = math.std(this.allRequests)
    this.allRequestsSum[3] = math.min(this.allRequests)
    this.allRequestsSum[4] = math.max(this.allRequests)

    this.latencySum[0] = math.mean(this.avgLatency)
    this.latencySum[1] = math.variance(this.avgLatency)
    this.latencySum[2] = math.std(this.latencySum)
    this.latencySum[3] = math.min(this.latencySum)
    this.latencySum[4] = math.max(this.latencySum)

    this.errorRateSum[0] = math.mean(this.errorRate)
    this.errorRateSum[1] = math.variance(this.errorRate)
    this.errorRateSum[2] = math.std(this.errorRate)
    this.errorRateSum[3] = math.min(this.errorRate)
    this.errorRateSum[4] = math.max(this.errorRate)

    this.succRequestsSum[0] = math.mean(this.succRequests)
    this.succRequestsSum[1] = math.variance(this.succRequests)
    this.succRequestsSum[2] = math.std(this.succRequests)
    this.succRequestsSum[3] = math.min(this.succRequests)
    this.succRequestsSum[4] = math.max(this.succRequests)

    this.sensorsSum[0] = math.mean(this.sensors)
    this.sensorsSum[1] = math.variance(this.sensors)
    this.sensorsSum[2] = math.std(this.sensors)
    this.sensorsSum[3] = math.min(this.sensors)
    this.sensorsSum[4] = math.max(this.sensors)

  }


  getPerformanceMetrics() {
    this.crudService.getAll(API_URL + PERFORMANCE).subscribe(
      (response) => {
        console.log(response)
        this.metrics = response.data
        this.metrics.forEach(
          x => {
            this.splitData(x)
          })

      });
  }




  ngOnInit() {
    this.getPerformanceMetrics()
    this.socketioService.getSocketInstance().on('performance', (metric) => {
      this.splitData(metric)
    });

  }


}
