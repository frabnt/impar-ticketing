import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ModifyAccessCodePage } from "../modify-access-code/modify-access-code";
import { HomeTabs } from "../home-tabs/tabs";
import {SettingsService} from "../../providers/settings-service";

/*
  Generated class for the Login page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage implements OnInit {
  accessCode: string;
  accessCodesList: string[];
  loginForm: FormGroup;

  constructor(public navCtrl: NavController,
              private builder: FormBuilder,
              private modalCtrl: ModalController,
              private settingsService: SettingsService) {
    this.accessCodesList = [];
    this.loginForm = builder.group({
      'accessCode': ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.settingsService.getAccessCodesList().then(list => {
      this.accessCodesList = list;
    });
  }

  login(accessCode: string) {
    let token = "token";
    this.navCtrl.setRoot(HomeTabs,
      {token},
      {animate: true, direction: 'forward'});
  }

  manageAccessCodes() {
    let addModal = this.modalCtrl.create(ModifyAccessCodePage, {codeList: this.accessCodesList});
    addModal.onDidDismiss( (codeList?) => {
      if(codeList) {
        this.accessCodesList = codeList;
      }
    });
    addModal.present();
  }

}
