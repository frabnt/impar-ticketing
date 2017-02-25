import { Component, OnInit } from '@angular/core';
import { NavController, ModalController, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ModifyAccessCodePage } from "../manage-access-codes/manage-access-codes";
import { HomeTabs } from "../home-tabs/tabs";
import { VfsApiService } from "../../services/vfs-api/vfs-api-service";
import { SpinnerService } from "../../services/utils/spinner-service";
import { DatabaseService } from "../../services/database/database-service";
import { Manifest } from "../../models/manifest";
import { Storage } from "@ionic/storage";
import { DBMappingService } from "../../services/db-mapping/db-mapping-service";
import { TicketsPaginationService } from "../../services/tickets-pagination/tickets-pagination-service";
/*
  Generated class for the Login page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/

@Component({
  selector: 'page-login',
  templateUrl: './login.html'
})
export class LoginPage implements OnInit {
  accessCodesList: string[]; //store access codes list
  loginForm: FormGroup; //used to manage login form

  /**
   * @constructor
   * @param {NavController} navCtrl
   * @param {FormBuilder} builder
   * @param {ModalController} modalCtrl
   * @param {Storage} storageService
   * @param {VfsApiService} vfsApiService
   * @param {SpinnerService} spinnerService
   * @param {AlertController} alertCtrl
   * @param {DatabaseService} database
   * @param {DatabaseService} database
   * @param {DBMappingService} mappingService
   * @param {TicketsPaginationService} ticketsPagService
   */
  constructor(private navCtrl: NavController,
              private builder: FormBuilder,
              private modalCtrl: ModalController,
              private storageService: Storage,
              private vfsApiService: VfsApiService,
              private spinnerService: SpinnerService,
              private alertCtrl: AlertController,
              private database: DatabaseService,
              private mappingService: DBMappingService,
              private ticketsPagService: TicketsPaginationService) {
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
        this.spinnerService.setContent('Retrieving and deserializing manifest data...');
        return this.vfsApiService.getManifest();
      })
      .then((manifest: Manifest) => {
        this.spinnerService.setContent('Mapping manifest data...');
        return this.mappingService.mapManifestData(manifest);
      })
      .then(() => {
        return this.ticketsPagService.getAllTickets();
      })
      .then(() => {
        return this.goToHome();
      })
      .catch(err => {
        this.spinnerService.dismiss();
        // If login goes wrong, an error message is displayed
        this.alertCtrl.create({
          title: 'LOGIN ERROR',
          message: `Something goes wrong during login: ${err}`,
          buttons: [
            {
              text: 'Ok'
            }
          ]
        }).present();
      });
  }

  /**
   * Retrieve stats and navigate to home page
   */
  goToHome(): Promise<any> {
    // Update spinner content
    this.spinnerService.setContent('Calculating stats...');
    // Retrieving stats need to be passed to Report page
    return this.database.calculateStats()
      .then(stats => {
        // Dismiss the spinner before entering in Report page
        this.spinnerService.dismiss();

        return this.navCtrl.setRoot(
          HomeTabs,
          { totalManifest: stats[0], totalTickets: stats[1] },
          { animate: true, direction: 'forward' }
        );
      });
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
