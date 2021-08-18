import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {API_URL, PERFORMANCE, RESOURCE} from '../globals/global_variables';
import {DatePipe} from '@angular/common';
import {CrudService} from '../services/crud.service';

import html2canvas from "html2canvas";
import jsPDF from 'jspdf';
@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
  providers: [DatePipe]
})
export class ReportComponent implements OnInit {


  private cpus = [];
  private mems = [];
  private netI = [];
  private netO = [];
  private cpusPerContainer = [];
  private memPerContainer = [];
  private netIperContainer = [];
  private netOperContainer = [];
  private labels = [];
  private labelsPerformance = [];
  private allRequests = [];
  private avgLatency = [];
  private errorRate = [];
  private sensors = [];
  private succRequests = [];
  public metrics: any;
  public performanceMetrics: any;
  private firstLoad: boolean = true;
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
  public cpuPerNodeData = [{
    label: "CPU %",
    data: [],
    borderWidth: 1,
    borderColor: this.borderColor[0],
    backgroundColor: this.backgroundColor[0],
    fill: false
  }];
  public memPerNodeData = [];
  public netInPerNodeData = [];
  public netOuPerNodeData = [];

  cpuData = [{
    label: 'Average CPU %',
    data: this.cpus,
    borderWidth: 1,
    fill: false
  }];
  memData = [{
    label: 'Average MEM %',
    data: this.mems,
    borderWidth: 1,
    fill: false
  }];

  netInData = [{
    label: 'Average Net Input (B)',
    data: this.netI,
    borderWidth: 1,
    fill: false
  }];
  netOuData = [{
    label: 'Average Net output (B)',
    data: this.netO,
    borderWidth: 1,
    fill: false
  }];

  requestsData = [{
    label: '# Total Requests',
    data: this.allRequests,
    borderWidth: 1,
    fill: false,
    borderColor: this.borderColor[0],
    backgroundColor: this.backgroundColor[0],
  }, {
    label: '# Successful Requests',
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
  lineChartLabelsPerformance = this.labelsPerformance;

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
          beginAtZero: true,
          suggestedMax: 100,
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

  lineChartOptionsPerformance = {

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

  constructor(private crudService: CrudService,
              private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.getResourceMetrics()
    this.getPerformanceMetrics()

  }

  getResourceMetrics() {
    this.crudService.getAll(API_URL + RESOURCE).subscribe(
      (response) => {
        console.log(response)
        this.metrics = response.data
        this.metrics.forEach(
          x => {
            this.splitData(x)
          })
        this.setCpuPerNodeData()
        this.setMemPerNodeData()
        this.setNetInPerNodeData()
        this.setNetOuPerNodeData()
        this.firstLoad = false
      });
  }

  getPerformanceMetrics() {
    this.crudService.getAll(API_URL + PERFORMANCE).subscribe(
      (response) => {
        console.log(response)
        this.performanceMetrics = response.data
        this.performanceMetrics.forEach(
          x => {
            this.splitDataPerformance(x)
          })

      });
  }

  splitData(data) {
    this.labels.push(this.datePipe.transform(data.time, 'hh:mm:ss'))
    this.cpus.push(data.avgCPU)
    this.mems.push(data.avgMEM)
    this.netI.push(data.avgNetI)
    this.netO.push(data.avgNetO)
    if (data.containers){
      data.containers.forEach(
        x => {
          if (!this.cpusPerContainer[x.name]) {
            this.cpusPerContainer[x.name] = []
            this.memPerContainer[x.name] = []
            this.netIperContainer[x.name] = []
            this.netOperContainer[x.name] = []
          }
          this.cpusPerContainer[x.name].push(x.cpu)
          this.memPerContainer[x.name].push(x.mem)
          this.netIperContainer[x.name].push(x.netI)
          this.netOperContainer[x.name].push(x.netO)
        }
      )
    }

  }

  splitDataPerformance(data) {

    this.labelsPerformance.push(this.datePipe.transform(data.time, 'hh:mm:ss'))
    this.allRequests.push(data.allRequests)
    this.avgLatency.push(data.avgLatency)
    this.errorRate.push(data.errorRate)
    this.succRequests.push(data.succRequests)
    this.sensors.push(data.sensors)

  }

  setCpuPerNodeData() {

    var i = 0;
    if(this.firstLoad){
      this.cpuPerNodeData.pop()
    }

    for (let name in this.cpusPerContainer) {

      this.cpuPerNodeData.push({
        data: this.cpusPerContainer[name],
        label: name,
        borderWidth: 1,
        borderColor: this.borderColor[i],
        backgroundColor: this.backgroundColor[i],
        fill: false
      })
      i++;
    }

  }

  setMemPerNodeData() {
    var i = 0;
    if(this.firstLoad){
      this.memPerNodeData.pop()
    }
    for (let name in this.memPerContainer) {

      this.memPerNodeData.push({
        data: this.memPerContainer[name],
        label: name,
        borderWidth: 1,
        borderColor: this.borderColor[i],
        backgroundColor: this.backgroundColor[i],
        fill: false
      })
      i++;
    }

  }

  setNetInPerNodeData() {
    var i = 0;
    if(this.firstLoad){
      this.netInPerNodeData.pop()
    }
    for (let name in this.netIperContainer) {

      this.netInPerNodeData.push({
        data: this.netIperContainer[name],
        label: name,
        borderWidth: 1,
        borderColor: this.borderColor[i],
        backgroundColor: this.backgroundColor[i],
        fill: false
      })
      i++;
    }

  }

  setNetOuPerNodeData() {
    var i = 0;
    if(this.firstLoad){
      this.netOuPerNodeData.pop()
    }
    for (let name in this.netOperContainer) {

      this.netOuPerNodeData.push({
        data: this.netOperContainer[name],
        label: name,
        borderWidth: 1,
        borderColor: this.borderColor[i],
        backgroundColor: this.backgroundColor[i],
        fill: false
      })
      i++;
    }

  }

  @ViewChild('contentToConvert', {static: false}) contentToConvert: ElementRef;
  public downloadAsPDF() {


    var data = document.getElementById('contentToConvert');


    html2canvas(data , {scrollY: -window.scrollY, scale: 1}).then(canvas => {
      var options = {
        background: '#fff',
        pagesplit: true
      };
      let docWidth = 208;
      let docHeight = canvas.height * docWidth / canvas.width;

      const contentDataURL = canvas.toDataURL('image/png')
      let doc = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      doc.addImage(contentDataURL, 'PNG', 0, position, docWidth, docHeight)

      doc.save('exportedPdf.pdf');
    });
  }



}
