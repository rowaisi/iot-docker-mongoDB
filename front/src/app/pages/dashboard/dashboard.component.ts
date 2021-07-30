import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js';
import { SocketioService } from 'src/app/services/socketio.service';
import { DatePipe } from '@angular/common'
// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2
} from "../../variables/charts";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [DatePipe]
})
export class DashboardComponent implements OnInit {
  public metrics: any;
  public datasets: any;
  public data: any;
  public cpuChart;
  public memChart;
  public clicked: boolean = true;
  public clicked1: boolean = false;
  public clickedCPU: boolean = true;
  public clickedCPU1: boolean = false;
  private labels = [];
  private cpus = [];
  private mems = [];
  public borderColor = ["#3cb371","#FF5733","#477337","#4E52A0","#CD6724"]
  public cpusPerContainer = {};
  public memPerContainer = {};
  private labelString: any;

  constructor(
    private socketioService: SocketioService,
    private datePipe: DatePipe
  ) {}

  initializeCPUChart() {
    var chartCPU = document.getElementById('chart-cpus');
    this.cpuChart = new Chart(chartCPU, {
      responsive: true,
      maintainAspectRatio: false,
      type: 'line',
      data: {
        labels: this.labels,
        datasets: this.datasets
      },
      options: {
        legend: {
          display: true

        },
        scales: {
          xAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Time',
              fontColor: '#20d3b5',
              fontSize: 18
            },
            ticks: {
              fontColor: '#20d3b5',
              fontSize: 18
            }
          }],
          yAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString:  'CPU utilization %',
              fontColor: '#20d3b5',
              fontSize: 18
            },
            ticks: {
              fontColor: '#20d3b5',
              fontSize: 18,
              beginAtZero: true,
              suggestedMax: 100,
              //callback: function(value) {if (value % 1 === 0) {return value;}}
            }
          }],
        }
      }
    });
  }

  initializeMemChart() {
    var chartMEM = document.getElementById('chart-mems');
    this.memChart = new Chart(chartMEM, {
      responsive: true,
      maintainAspectRatio: false,
      type: 'line',
      data: {
        labels: this.labels,
        datasets: this.datasets
      },
      options: {
        legend: {
          display: true

        },
        scales: {
          xAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Time',
              fontColor: '#20d3b5',
              fontSize: 18
            },
            ticks: {
              fontColor: '#20d3b5',
              fontSize: 18
            }
          }],
          yAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString:  'MEM utilization %',
              fontColor: '#20d3b5',
              fontSize: 18
            },
            ticks: {
              fontColor: '#20d3b5',
              fontSize: 18,
              beginAtZero: true,
              suggestedMax: 100,
              //callback: function(value) {if (value % 1 === 0) {return value;}}
            }
          }],
        }
      }
    });
  }

  setLabels() {
    this.metrics.forEach(
      x => {

        this.labels.push(this.datePipe.transform(x.time, 'hh:mm:ss'))
      }
    );
    this.cpuChart.data.labels = this.labels;
    this.memChart.data.labels = this.labels;
  }

  setCpuData() {
    this.metrics.forEach(
      x => {
        this.cpus.push(x.avgCPU)
      }
    );

  }



  setCpuPerContainerData() {
    this.metrics.forEach(
      x => {
        if (x.containers){
          x.containers.forEach(
            data => {
              if (!this.cpusPerContainer[data.name]) {
                this.cpusPerContainer[data.name] = []
              }
              this.cpusPerContainer[data.name].push(data.cpu)
            }
          )
        }

      }
    )
  }

  setMemPerContainerData(){
    this.metrics.forEach(
      x => {
        if (x.containers){
          x.containers.forEach(
            data => {
              if (!this.memPerContainer[data.name]) {
                this.memPerContainer[data.name] = []
              }
              this.memPerContainer[data.name].push(data.mem)
            }
          )
        }

      }
    )
  }

  setMemData() {
    this.metrics.forEach(
      x => {
        this.mems.push(x.avgMEM)
      }
    );

  }

  setDatasetToCpuPerNode() {
    this.setDatasetForXLines(Object.keys(this.cpusPerContainer).length)
    var i = 0
    for (let name in this.cpusPerContainer) {
      this.cpuChart.data.datasets[i].data = this.cpusPerContainer[name];
      this.cpuChart.data.datasets[i].label = name
     i++
    }

    this.cpuChart.update();
  }

  setDatasetToMemPerNode() {
    this.setDatasetForXLines(Object.keys(this.memPerContainer).length)
    var i = 0
    for (let name in this.memPerContainer) {
      this.memChart.data.datasets[i].data = this.memPerContainer[name];
      this.memChart.data.datasets[i].label = name
      i++
    }

    this.memChart.update();
  }

  setDatasetForXLines(x){
    if (this.cpuChart.data.datasets.length > x){
      this.cpuChart.data.datasets.splice(x,this.cpuChart.data.datasets.length)
    }
    for (let i = 0; i < x; i++) {
      if (!this.cpuChart.data.datasets[i]) {
        this.datasets[i] = {
          data: [],
          fill: false,
          borderColor: this.borderColor[i],
          backgroundColor: "#0000FF",
        }
      }
    }
  }

  setDatasetToAvgCpu() {
    this.setDatasetForXLines(1)
    this.cpuChart.data.datasets[0].data = this.cpus;
    this.cpuChart.update();
  }

  setDatasetToAvgMem() {
    this.setDatasetForXLines(1)
    this.memChart.data.datasets[0].data = this.mems;
    this.memChart.update();
  }

  ngOnInit() {

    this.datasets = [
      {
        label: "Average",
        data: [],
        fill: false,
        borderColor: '#3cb371',
        backgroundColor: "#0000FF",
      }
    ]

    var chartOrders = document.getElementById('chart-orders');

    parseOptions(Chart, chartOptions());


    var ordersChart = new Chart(chartOrders, {
      type: 'bar',
      options: chartExample2.options,
      data: chartExample2.data
    });


    // send an event to request metrics whenever the user opens the dashboard page
    this.socketioService.getSocketInstance().emit('initialData');

    this.initializeCPUChart();
    this.initializeMemChart();


    this.socketioService.getSocketInstance().on('initial_data', (metrics) => {
      console.log("initial")
      this.metrics = metrics
      console.log(this.metrics)
      this.setLabels();
      this.setCpuData();
      this.setMemData();
      this.setCpuPerContainerData()
      this.setMemPerContainerData()
      this.cpuChart.data.datasets[0].data = this.cpus;
      this.memChart.data.datasets[0].data = this.mems;
      this.cpuChart.update();
      this.memChart.update();

    });


    this.socketioService.getSocketInstance().on('resource', (metric) => {
      console.log(metric)
      this.newData(metric)
    });
  }


  public newData(metric) {
    console.log("new data")
    this.cpus.push(metric.avgCPU)
    this.mems.push(metric.avgMEM)
    this.labels.push(this.datePipe.transform(metric.time, 'hh:mm:ss'))
    this.cpuChart.data.datasets[0].data = this.cpus;
    this.memChart.data.datasets[0].data = this.mems;
    this.cpuChart.data.labels = this.labels;
    this.memChart.data.labels = this.labels;
    this.cpuChart.update();
    this.memChart.update()
  }


  public updateOptions() {
    this.cpuChart.data.datasets[0].data = this.data;
    this.cpuChart.update();
    this.memChart.data.datasets[0].data = this.data;
    this.memChart.update();
  }

}
