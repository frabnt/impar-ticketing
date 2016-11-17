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
import { StatsService } from "../../services/stats/stats-service";

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
  spinner: any;

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
              private statsService: StatsService,
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
    let manifest: Manifest,
        tickets: Tickets;
    this.spinner = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Waiting for login...',
    });

    this.spinner.present();

    this.vfsApiService.doLogin(accessCode)
      .then((res) => {
        return this.setApiCredentials(res);
      })
      .then(() => {
        return this.platform.ready();
      })
      .then(() => {
        this.database.openDatabase();
        this.setSpinnerContent('Creating tables...');
        return this.database.createTables();
      })
      .then(() => {
        this.setSpinnerContent('Retrieving data...');
        return this.retrieveData();
      })
      .then((results) => {
        this.setSpinnerContent('Deserializing manifest...');
        manifest = Deserialize(results[0].json(), Manifest);
        console.log(manifest);

        this.setSpinnerContent('Deserializing tickets...');
        tickets = Deserialize(results[1].json(), Tickets);
        console.log(tickets);

        this.setSpinnerContent('Retrieve and deserializing remaining tickets...');
        return this.retrieveRemainingTickets(tickets.pagination.lastPage);
      })
      .then((result) => {
        this.addRemainingTickets(tickets, result);
        return this.insertDataInDB(manifest, tickets);
      })
      .then(() => {
        return this.storeStats();
      })
      .then(() => {
        this.spinner.dismiss();
        this.goToHome();
      })
      .catch(err => {
        this.spinner.dismiss();
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
   * If tickets returned by the server are split into more pages,
   * we need to retrieve remaining pages
   * @param pagesNumber - number of remaining pages to retrieve
   * @returns {Promise<[T1,T2,T3,T4,T5,T6,T7,T8,T9,T10]>}
   */
  private retrieveRemainingTickets(pagesNumber: number): Promise<any> {
    return Promise.all(
      Array.from(
        Array(pagesNumber - 1),
        (x,i) => i+2
      ).map((page) => {
        return this.vfsApiService.getTickets(page);
      })
    );
  }

  /**
   * Add remaining tickets
   * @param tickets - the object to which remaining tickets must be added
   * @param results - http responses containing remaining tickets
   */
  private addRemainingTickets(tickets: Tickets, results) {
    results.map(result => {
      tickets.pushTickets(
        Deserialize(result.json(), Tickets)
      );
    });
  }

  /**
   * Insert manifest and tickets data in the database
   * @param {Manifest} manifest - manifest data
   * @param {Tickets} tickets - tickets data
   * @param spinner
   * @returns {PromiseLike<Promise<any>>}
   */
  private insertDataInDB(manifest: Manifest, tickets: Tickets): Promise<any> {
    let stats = this.statsService.stats;
    stats.totalTickets = tickets.orders.length + tickets.ordersTransactions.length;
    stats.totalManifest = manifest.manifest.length;

    let startManifest: number,
        startTickets:  number = new Date().getTime();

    this.setSpinnerContent('Inserting orders...');

    return this.database.batchInsertInTable(
      'orders',
      tickets.orders
    )
      .then(() => {
        stats.ticketsTime = ( new Date().getTime() ) - startTickets;
        this.setSpinnerContent('Inserting event...');
        return this.database.insertInTable(
          'event',
          manifest.event );
      })
      .then(() => {
        this.setSpinnerContent('Inserting credential types...');
        return this.database.batchInsertInTable(
          'credentials_types',
          manifest.credentialTypes );
      })
      .then(() => {
        this.setSpinnerContent('Inserting registrants...');
        return this.database.batchInsertInTable(
          'registrants',
          manifest.registrants );
      })
      .then(() => {
        this.setSpinnerContent('Inserting reports...');
        return this.database.batchInsertInTable(
          'reports',
          manifest.getReports(manifest.reports) );
      })
      .then(() => {
        this.setSpinnerContent('Inserting zones...');
        return this.database.batchInsertInTable(
          'zones',
          manifest.zones );
      })
      .then(() => {
        this.setSpinnerContent('Inserting schedules...');
        return this.database.batchInsertInTable(
          'schedules',
          manifest.schedules );
      })
      .then(() => {
        this.setSpinnerContent('Inserting manifest...');
        startManifest = new Date().getTime();
        return this.database.batchInsertInTable(
          'manifest',
          manifest.manifest );
      })
      .then(() => {
        stats.manifestTime = ( new Date().getTime() ) - startManifest;
        this.setSpinnerContent('Inserting zones acl...');
        return this.database.batchInsertInTable(
          'zones_acl',
          manifest.zonesAcl );
      })
      .then(() => {
        this.setSpinnerContent('Inserting zones acl passes...');
        return this.database.batchInsertInTable(
          'zones_acl_passes',
          manifest.zonesAclPasses );
      })
      .then(() => {
        this.setSpinnerContent('Inserting zones scanning points...');
        return this.database.batchInsertInTable(
          'zones_scanning_points',
          manifest.zonesScanningPoints );
      })
      .then(() => {
        this.setSpinnerContent('Inserting orders transactions...');
        startTickets = new Date().getTime();
        return this.database.batchInsertInTable(
          'orders_transactions',
          tickets.ordersTransactions );
      })
      .then(() => {
        stats.ticketsTime = stats.ticketsTime +
          ( new Date().getTime() ) -
          startTickets;
        this.setSpinnerContent('Inserting reports contents...');
        return this.database.batchInsertInTable(
          'reports_contents',
          manifest.getReportsContents(manifest.reports) );
      })
      .then(() => {
        this.setSpinnerContent('Inserting schedules segments...');
        return this.database.batchInsertInTable(
          'schedules_segments',
          manifest.schedulesSegments );
      })
      .then(() => {
        this.setSpinnerContent('Inserting scanning exceptions...');
        return this.database.batchInsertInTable(
          'scanning_exceptions',
          manifest.scanningExceptions);
      })
      .then(() => {
        this.setSpinnerContent('Inserting scanning exceptions zones acl...');
        return this.database.batchInsertInTable(
          'scanning_exceptions_zones_acl',
          manifest.scanningExceptionsZonesAcl );
      });
  }

  /**
   * Set spinner textual content
   * @param content - the text to insert
   */
  private setSpinnerContent(content: string) {
    if(this.spinner) {
      this.spinner.setContent(content);
    }
  }

  /**
   * Update total number of entities and total import time.
   * Then store stats using stats-service
   * @returns {Promise<any>}
   */
  private storeStats(): Promise<any> {
    let stats = this.statsService.stats;
    stats.totalTime = stats.manifestTime + stats.ticketsTime;
    stats.totalEntities = stats.totalManifest + stats.totalTickets;

    return this.statsService.storeStats();
  }

  /**
   * Navigate to home page
   */
  private goToHome() {
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
    addModal.onDidDismiss( (codeList?) => {
      if(codeList) {
        this.accessCodesList = codeList;
      }
    });
    addModal.present();
  }

}
