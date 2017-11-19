import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { LoginService } from '../services/login.service';
import { User } from '../models/user.model';


@Component({
  selector: 'app-updateUser',
  templateUrl: './updateUser.component.html',
  styleUrls: ['./updateUser.component.css']
})
export class UpdateUserComponent implements OnInit {

  public user: User;
  public titulo: string;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _loginService: LoginService
  ) {
    this.titulo = "Actualizar Usuario"
    this.user = new User("","", "" ,"", "", "");
  }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('usuario'));
  }
  onSubmit() {
    console.log(this.user);
    this._loginService.updateUser(this.user).subscribe(res => {
      if(res.code == 200){
        console.log(res.message);
      }else{
      console.log(res.message);
    }
    }, err => {
      console.log(err);
    });

  }

}
