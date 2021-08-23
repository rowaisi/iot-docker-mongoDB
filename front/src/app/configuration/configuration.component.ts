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
  public blockchain = ""
  public consensus = ""
  public nodes = 0
  public size = 1


  constructor(private crudService: CrudService) { }

  ngOnInit(): void {
    this.getConfiguration()
  }

  getConfiguration() {
    this.crudService.getAll(API_URL + CONFIGURATION).subscribe(
      (response) => {
       console.log(response.data)
        this.blockchain = response.data.blockchain
        this.consensus = response.data.consensus
        this.nodes = response.data.nodes
        this.size = response.data.size
        // this.receivers =response.data.receivers.join('\r\n')
        this.receivers =response.data.receivers.join(' ; ')


      });
  }

}
