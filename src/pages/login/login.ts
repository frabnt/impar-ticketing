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
    this.spinnerService.createSpinner({
      spinner: 'bubbles',
      content: 'Waiting for login...',
    });

    this.spinnerService.presentSpinner();

    this.vfsApiService.doLogin(accessCode)
      .then(() => {
        return this.database.openDatabase();
      })
      .then(() => {
        this.spinnerService.setSpinnerContent('Creating tables...');
        return this.database.createTables();
      })
      .then(() => {
        this.spinnerService.setSpinnerContent('Retrieving and deserializing data...');
        return Promise.all<Manifest, Tickets>([
          this.vfsApiService.getManifest(),
          this.vfsApiService.getAllTickets()
        ]);
      })
      .then(results => {
        return this.insertDataInDB(results[0], results[1]);
      })
      .then(() => {
        this.spinnerService.dismissSpinner();
        this.goToHome();
      })
      .catch(err => {
        console.log(err);
        this.spinnerService.dismissSpinner();
        // If login goes wrong, an error message is displayed
        this.alertCtrl.create({
          title: 'Login error',
          message: 'Error! Something goes wrong during login: '+JSON.stringify(err),
          buttons: [
            {
              text: 'Ok'
            }
          ]
        }).present();
      });
  }

  /**
   * Insert manifest and tickets data in the database
   * @param {Manifest} manifest - manifest data
   * @param {Tickets} tickets - tickets data
   * @returns {PromiseLike<any>} that resolves after all batch inserts are done
   */
  private insertDataInDB(manifest: Manifest, tickets: Tickets): Promise<any> {
    let startManifest: number,
        startTickets:  number = this.execTimeService.startCounting();

    this.spinnerService.setSpinnerContent('Inserting orders...');

    return this.database.batchInsertInTable(
      'orders',
      tickets.orders
    )
      .then(() => {
        this.execTimeService.setTime(
          'ticketsTime',
          this.execTimeService.endCounting(startTickets)
        );
        this.spinnerService.setSpinnerContent('Inserting event...');
        return this.database.insertInTable(
          'event',
          manifest.event );
      })
      .then(() => {
        this.spinnerService.setSpinnerContent('Inserting credential types...');
        return this.database.batchInsertInTable(
          'credentials_types',
          manifest.credentialTypes );
      })
      .then(() => {
        this.spinnerService.setSpinnerContent('Inserting registrants...');
        return this.database.batchInsertInTable(
          'registrants',
          manifest.registrants );
      })
      .then(() => {
        this.spinnerService.setSpinnerContent('Inserting reports...');
        return this.database.batchInsertInTable(
          'reports',
          manifest.getReports(manifest.reports) );
      })
      .then(() => {
        this.spinnerService.setSpinnerContent('Inserting zones...');
        return this.database.batchInsertInTable(
          'zones',
          manifest.zones );
      })
      .then(() => {
        this.spinnerService.setSpinnerContent('Inserting schedules...');
        return this.database.batchInsertInTable(
          'schedules',
          manifest.schedules );
      })
      .then(() => {
        this.spinnerService.setSpinnerContent('Inserting manifest...');
        startManifest = this.execTimeService.startCounting();
        return this.database.batchInsertInTable(
          'manifest',
          manifest.manifest );
      })
      .then(() => {
        this.execTimeService.setTime(
          'manifestTime',
          this.execTimeService.endCounting(startManifest)
        );
        this.spinnerService.setSpinnerContent('Inserting zones acl...');
        return this.database.batchInsertInTable(
          'zones_acl',
          manifest.zonesAcl );
      })
      .then(() => {
        this.spinnerService.setSpinnerContent('Inserting zones acl passes...');
        return this.database.batchInsertInTable(
          'zones_acl_passes',
          manifest.zonesAclPasses );
      })
      .then(() => {
        this.spinnerService.setSpinnerContent('Inserting zones scanning points...');
        return this.database.batchInsertInTable(
          'zones_scanning_points',
          manifest.zonesScanningPoints );
      })
      .then(() => {
        this.spinnerService.setSpinnerContent('Inserting orders transactions...');
        startTickets = this.execTimeService.startCounting();
        return this.database.batchInsertInTable(
          'orders_transactions',
          tickets.ordersTransactions );
      })
      .then(() => {
        this.execTimeService.setTime(
          'ticketsTime',
          this.execTimeService.getTime('ticketsTime') +
          this.execTimeService.endCounting(startTickets)
        );
        this.spinnerService.setSpinnerContent('Inserting reports contents...');
        return this.database.batchInsertInTable(
          'reports_contents',
          manifest.getReportsContents(manifest.reports) );
      })
      .then(() => {
        this.spinnerService.setSpinnerContent('Inserting schedules segments...');
        return this.database.batchInsertInTable(
          'schedules_segments',
          manifest.schedulesSegments );
      })
      .then(() => {
        this.spinnerService.setSpinnerContent('Inserting scanning exceptions...');
        return this.database.batchInsertInTable(
          'scanning_exceptions',
          manifest.scanningExceptions);
      })
      .then(() => {
        this.spinnerService.setSpinnerContent('Inserting scanning exceptions zones acl...');
        return this.database.batchInsertInTable(
          'scanning_exceptions_zones_acl',
          manifest.scanningExceptionsZonesAcl );
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
