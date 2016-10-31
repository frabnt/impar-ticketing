import { Component, OnInit } from '@angular/core';
import {NavController, ModalController, LoadingController, AlertController} from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ModifyAccessCodePage } from "../manage-access-codes/manage-access-codes";
import { HomeTabs } from "../home-tabs/tabs";
import { SettingsService } from "../../providers/settings-service";
import { VfsApiService } from "../../providers/vfs-api-service";

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
              private vfsApiService: VfsApiService,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController) {
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

    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Waiting for login...',
    });
    loading.present();

    this.vfsApiService.doLogin(accessCode)
      .then((res) => {
        // Retrieve api token and event id after successful login
        let apiToken = res.headers.get("X-VENDINI-API-TOKEN"),
          eventID = res.headers.get("X-VENDINI-EVENT-ID");
        // Set credentials of vfs api service and store these ones
        // in the storage
        this.vfsApiService.setCredentials(apiToken, eventID);
        return Promise.all([
          this.settingsService.setApiToken(apiToken),
          this.settingsService.setEventID(eventID)
        ]);
      })
      .then(() => {
        // Once credentials have been stored, the view is dismissed
        // and we can navigate to HomeTabs page
        loading.dismiss();
        this.navCtrl.setRoot(
          HomeTabs,
          {},
          {animate: true, direction: 'forward'}
        );
      })
      .catch(err => {
        loading.dismiss();
        // If login goes wrong, an error message is displayed
        this.alertCtrl.create({
          title: 'Login error',
          message: 'Error! Something goes wrong during login.',
          buttons: [
            {
              text: 'Ok'
            }
          ]
        }).present();
      });
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
