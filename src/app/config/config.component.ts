import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ConfigService } from '../services/config.service';
import {Config} from '../models/config.model';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit {
  public titulo:string;
  public config:Config;
  constructor(
    private _config: ConfigService
  ) {
    this.titulo = "Configuraciones";
    this.config = new Config();
  }

  ngOnInit() {
    this.getConfig();
  }
  getConfig(){
    this._config.getConf().subscribe(res=>{
      if(res.code == 200){
        this.config = JSON.parse(res.data);
      }
      console.log(res);
    }, err=>{
      console.log(err);
    })
  }
  setConfig(){
    this._config.setConf(this.config).subscribe(res=>{
      console.log(res);
    }, err=>{
      console.log(err);
    })
  }
  limpiar(){
    this.config = new Config();
  }

}
