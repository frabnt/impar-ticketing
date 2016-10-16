import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ModifyAccessCodePage } from "../modify-access-code/modify-access-code";
import { HomeTabs } from "../home-tabs/tabs";

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
              private builder: FormBuilder,
              private modalCtrl: ModalController) {
    this.accessCodesList = ['ac1', 'ac2', 'ac3'];
    this.loginForm = builder.group({
      'accessCode': ['', Validators.required]
    });
  }

  login(accessCode: string) {
    let token = "token";
    this.navCtrl.setRoot(HomeTabs,
      {token},
      {animate: true, direction: 'forward'});
  }

  modifyAccessCode(code: string, index: number) {
    let addModal = this.modalCtrl.create(ModifyAccessCodePage, {code: code});
    addModal.onDidDismiss( newCode => {
      this.accessCodesList[index] = newCode;
    });
    addModal.present();
  }

}
