import { Component, OnInit } from '@angular/core';
import { NavController, ModalController, LoadingController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ModifyAccessCodePage } from "../manage-access-codes/manage-access-codes";
import { HomeTabs } from "../home-tabs/tabs";
import { SettingsService } from "../../providers/settings-service";

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
  accessCodesList: string[]; //store access codes list
  loginForm: FormGroup; //used to manage login form

  /**
   * @constructor
   * @param navCtrl
   * @param builder
   * @param modalCtrl
   * @param localSettings
   */
  constructor(public navCtrl: NavController,
              private builder: FormBuilder,
              private modalCtrl: ModalController,
              private settingsService: SettingsService,
              private loadingCtrl: LoadingController) {
    this.accessCodesList = [];
    this.loginForm = builder.group({
      'accessCode': ['', Validators.required]
    });
  }

  /**
   * Retrieve stored access codes and assign them
   * to access code list variable
   */
  ngOnInit(): void {
    this.settingsService.getAccessCodesList().then(list => {
      if(list) {
        this.accessCodesList = list;
      }
    });
  }

  /**
   * Accomplish login using authentication service
   * @param accessCode {string} - value used for authentication
   */
  login(accessCode: string) {
    let token = "token";
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Waiting for login...'
    });

    loading.present();

    setTimeout(()=>{
      this.settingsService.setLogged()
        .then(() => {
          loading.dismiss();
          this.navCtrl.setRoot( //here we navigate to home page once login is successfully done
            HomeTabs,
            {token},
            {animate: true, direction: 'forward'}
          );
        });
    }, 2000);
  }

  /**
   * Open a modal window to manage stored access codes
   */
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
