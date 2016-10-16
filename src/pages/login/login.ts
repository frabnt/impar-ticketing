import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

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
  accessCodesList: string[];

  constructor(public navCtrl: NavController) {
    this.accessCodesList = ['ac1', 'ac2', 'ac3'];
  }

  ionViewDidLoad() {
    console.log('Hello Login Page');
  }

  login(accessCode: string) {

  }

  modifyAccessCode(code: string, index: number) {

  }

}
