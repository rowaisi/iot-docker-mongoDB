import { Component, OnInit } from '@angular/core';
import {CrudService} from "../services/crud.service";
import {API_URL, CONFIGURATION, RESOURCE} from "../globals/global_variables";

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit {
  public receivers = ""
  public configuration = {
                        blockchain: "",
                        consensus: "",
                        receivers: [],
                        nodes: 0,
                        size: 1
                      }

  constructor(private crudService: CrudService) { }

  ngOnInit(): void {
    this.getConfiguration()
  }

  getConfiguration() {
    this.crudService.getAll(API_URL + CONFIGURATION).subscribe(
      (response) => {
       console.log(response.data)
        this.configuration = response.data
        this.receivers =response.data.receivers.join('\r\n')


       console.log(this.receivers)

      });
  }

}
