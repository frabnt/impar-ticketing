import { Component, OnInit } from '@angular/core';
import { NavController, ModalController, LoadingController, AlertController, Platform } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ModifyAccessCodePage } from "../manage-access-codes/manage-access-codes";
import { HomeTabs } from "../home-tabs/tabs";
import { CredentialsService } from "../../services/credentials/credentials-service";
import { SettingsService } from "../../services/settings/settings-service";
import { VfsApiService } from "../../services/vfs-api/vfs-api-service";
import { DatabaseService } from "../../services/database/database-service";
import { Manifest } from "../../models/manifest";
import { Tickets } from "../../models/tickets";
import { Deserialize } from "cerialize";

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
  constructor(private navCtrl: NavController,
              private builder: FormBuilder,
              private modalCtrl: ModalController,
              private credentialsService: CredentialsService,
              private settingsService: SettingsService,
              private vfsApiService: VfsApiService,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              private database: DatabaseService,
              private platform: Platform) {
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
   * Accomplish login using authentication service. If login
   * is successful, data are retrieved and stored in the database
   * through vfs api service and database service, respectively
   * @param {string} accessCode - value used for authentication
   */
  login(accessCode: string) {
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Waiting for login...',
    });
    loading.present();

    this.vfsApiService.doLogin(accessCode)
      .then((res) => {
        return this.setApiCredentials(res);
      })
      .then(() => {
        return this.platform.ready();
      })
      .then(() => {
        this.database.openDatabase();
        loading.setContent('Creating tables...');
        return this.database.createTables();
      })
      .then(() => {
        loading.setContent('Retrieving data...');
        return this.retrieveData();
      })
      .then((results) => {
        loading.setContent('Deserializing manifest...');
        let manifest: Manifest = Deserialize(results[0].json(), Manifest);
        console.log(manifest);
        loading.setContent('Deserializing tickets...');
        let tickets: Tickets = Deserialize(results[1].json(), Tickets);
        console.log(tickets);

        return this.insertDataInDB(manifest, tickets, loading);
      })
      .then(() => {
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
   * Set api credential in vfs api service and store them
   * using settings service
   * @param res - result of login request
   * @returns {Promise<any>}
   */
  private setApiCredentials(res): Promise<any> {
    // Retrieve api token and event id after successful login
    let apiToken = res.headers.get("X-VENDINI-API-TOKEN"),
        eventID = res.headers.get("X-VENDINI-EVENT-ID");
    // Set credentials of vfs api service and store these ones
    // in the storage
    this.vfsApiService.setCredentials(apiToken, eventID);
    return Promise.all([
      this.credentialsService.setApiToken(apiToken),
      this.credentialsService.setEventID(eventID)
    ]);
  }

  /**
   * Insert manifest and tickets data in the database
   * @param {Manifest} manifest - manifest data
   * @param {Tickets} tickets - tickets data
   * @param spinner
   * @returns {PromiseLike<Promise<any>>}
   */
  private insertDataInDB(manifest: Manifest, tickets: Tickets, spinner): Promise<any> {
    return this.database.batchInsertInTable(
      'orders',
      tickets.orders
    )
      .then(() => {
        spinner.setContent('Inserting event...');
        return this.database.insertInTable(
          'event',
          manifest.event );
      })
      .then(() => {
        spinner.setContent('Inserting credential types...');
        return this.database.batchInsertInTable(
          'credentials_types',
          manifest.credentialTypes );
      })
      .then(() => {
        spinner.setContent('Inserting registrants...');
        return this.database.batchInsertInTable(
          'registrants',
          manifest.registrants );
      })
      .then(() => {
        spinner.setContent('Inserting reports...');
        return this.database.batchInsertInTable(
          'reports',
          manifest.getReports(manifest.reports) );
      })
      .then(() => {
        spinner.setContent('Inserting zones...');
        return this.database.batchInsertInTable(
          'zones',
          manifest.zones );
      })
      .then(() => {
        spinner.setContent('Inserting schedules...');
        return this.database.batchInsertInTable(
          'schedules',
          manifest.schedules );
      })
      .then(() => {
        spinner.setContent('Inserting manifest...');
        return this.database.batchInsertInTable(
          'manifest',
          manifest.manifest );
      })
      .then(() => {
        spinner.setContent('Inserting zones acl...');
        return this.database.batchInsertInTable(
          'zones_acl',
          manifest.zonesAcl );
      })
      .then(() => {
        spinner.setContent('Inserting zones acl passes...');
        return this.database.batchInsertInTable(
          'zones_acl_passes',
          manifest.zonesAclPasses );
      })
      .then(() => {
        spinner.setContent('Inserting zones scanning points...');
        return this.database.batchInsertInTable(
          'zones_scanning_points',
          manifest.zonesScanningPoints );
      })
      .then(() => {
        spinner.setContent('Inserting orders transactions...');
        return this.database.batchInsertInTable(
          'orders_transactions',
          tickets.ordersTransactions );
      })
      .then(() => {
        spinner.setContent('Inserting reports contents...');
        return this.database.batchInsertInTable(
          'reports_contents',
          manifest.getReportsContents(manifest.reports) );
      })
      .then(() => {
        spinner.setContent('Inserting schedules segments...');
        return this.database.batchInsertInTable(
          'schedules_segments',
          manifest.schedulesSegments );
      })
      .then(() => {
        spinner.setContent('Inserting scanning exceptions...');
        return this.database.batchInsertInTable(
          'scanning_exceptions',
          manifest.scanningExceptions);
      })
      .then(() => {
        spinner.setContent('Inserting scanning exceptions zones acl...');
        return this.database.batchInsertInTable(
          'scanning_exceptions_zones_acl',
          manifest.scanningExceptionsZonesAcl );
      });
  }

  /**
   * Retrieve all data (manifest and tickets)
   * @returns {Promise<any>}
   */
  private retrieveData(): Promise<any> {
    return Promise.all([
      this.vfsApiService.getManifest(),
      this.vfsApiService.getTickets(1)
    ]);
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
