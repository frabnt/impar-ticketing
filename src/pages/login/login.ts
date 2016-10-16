import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {FormGroup, FormBuilder, Validators} from "@angular/forms";

/*
  Generated class for the Login page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  accessCode: string;
  accessCodesList: string[];
  loginForm: FormGroup;

  constructor(public navCtrl: NavController,
              private builder: FormBuilder) {
    this.accessCodesList = ['ac1', 'ac2', 'ac3'];
    this.loginForm = builder.group({
      'accessCode': ['', Validators.required]
    });
  }

  ionViewDidLoad() {
    console.log('Hello Login Page');
  }

  login(accessCode: string) {

  }

  modifyAccessCode(code: string, index: number) {

  }

}
