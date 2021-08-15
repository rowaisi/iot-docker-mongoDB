import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import jsPDF from 'jspdf';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import htmlToPdfmake from 'html-to-pdfmake';
import { SocketioService } from 'src/app/services/socketio.service';
import { DatePipe } from '@angular/common';
import html2canvas from "html2canvas";
import {API_URL, PERFORMANCE} from "../../globals/global_variables";
import {CrudService} from "../../services/crud.service";


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
    label: '# Transmission rate',
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
    label: '# Number of sensors',
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
    //this.datePipe.transform(data.time, 'hh:mm:ss')
    this.labels.push(this.datePipe.transform(data.time, 'hh:mm:ss'))
    this.allRequests.push(data.allRequests)
    this.avgLatency.push(data.avgLatency)
    this.errorRate.push(data.errorRate)
    this.succRequests.push(data.succRequests)
    this.sensors.push(data.sensors)

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
    // // send an event to request metrics whenever the user opens the dashboard page
    // this.socketioService.getSocketInstance().emit('initialPerformance');
    // // receive initial data
    // this.socketioService.getSocketInstance().on('initial_performance', (metrics) => {
    //   this.metrics = metrics
    //   console.log(this.metrics)
    //   this.metrics.forEach(
    //     x => {
    //       this.splitData(x)
    //     })
    // });

    this.getPerformanceMetrics()
    this.socketioService.getSocketInstance().on('performance', (metric) => {
      this.splitData(metric)
   });

  }


}
