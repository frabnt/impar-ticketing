import { Component, OnInit } from '@angular/core';
import { NavController, ModalController, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ModifyAccessCodePage } from "../manage-access-codes/manage-access-codes";
import { HomeTabs } from "../home-tabs/tabs";
import { VfsApiService } from "../../services/vfs-api/vfs-api-service";
import { SpinnerService } from "../../services/utils/spinner-service";
import { DatabaseService } from "../../services/database/database-service";
import { Manifest } from "../../models/manifest";
import { Tickets } from "../../models/tickets";
import { ExecTimeService } from "../../services/exec-time/exec-time-service";
import { Storage } from "@ionic/storage";
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
   * @param {NavController} navCtrl
   * @param {FormBuilder} builder
   * @param {ModalController} modalCtrl
   * @param {LocalStorageService} storageService
   * @param {VfsApiService} vfsApiService
   * @param {SpinnerService} spinnerService
   * @param {ExecTimeService} execTimeService
   * @param {AlertController} alertCtrl
   * @param {DatabaseService} database
   */
  constructor(private navCtrl: NavController,
              private builder: FormBuilder,
              private modalCtrl: ModalController,
              private storageService: Storage,
              private vfsApiService: VfsApiService,
              private spinnerService: SpinnerService,
              private execTimeService: ExecTimeService,
              private alertCtrl: AlertController,
              private database: DatabaseService) {
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
    this.storageService.get('accessCodes').then(list => {
      if(list) {
        this.accessCodesList = list;
      }
    });
  }

  /**
   * Accomplish login using authentication service. If login
   * is successful, data are retrieved and stored in the database
   * through vfs api service and database service, respectively
   * @param {string} accessCode - value used for authentication
   */
  login(accessCode: string) {
    this.spinnerService.createAndShow(
      'Waiting for login...',
    );

    this.vfsApiService.doLogin(accessCode)
      .then(() => {
        return this.database.openDatabase();
      })
      .then(() => {
        this.spinnerService.setContent('Creating tables...');
        return this.database.createTables();
      })
      .then(() => {
        this.spinnerService.setContent('Retrieving and deserializing data...');
        return Promise.all<Manifest, Tickets>([
          this.vfsApiService.getManifest(),
          this.vfsApiService.getAllTickets()
        ]);
      })
      .then(results => {
        return this.database.insertAllData(
          results[0],
          results[1]
        );
      })
      .then(() => {
        this.spinnerService.dismiss();
        this.goToHome();
      })
      .catch(err => {
        console.log(err);
        this.spinnerService.dismiss();
        // If login goes wrong, an error message is displayed
        this.alertCtrl.create({
          title: 'Login error',
          message: `Error! Something goes wrong during login: ${err.err.message}`,
          buttons: [
            {
              text: 'Ok'
            }
          ]
        }).present();
      });
  }

  /**
   * Navigate to home page
   */
  goToHome() {
    this.navCtrl.setRoot(
      HomeTabs,
      {},
      {animate: true, direction: 'forward'}
    );
  }

  /**
   * Open a modal window to manage stored access codes
   */
  manageAccessCodes() {
    let addModal = this.modalCtrl.create(ModifyAccessCodePage, {codeList: this.accessCodesList});
    addModal.onDidDismiss(codeList => {
      if(codeList) {
        this.accessCodesList = codeList;
      }
    });
    addModal.present();
  }

}
