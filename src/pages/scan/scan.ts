import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import {App, AlertController, Platform, ToastController} from "ionic-angular";
import { ScanResultPage } from "../scan-result-tabs/scan-result-tabs";
import { DatabaseService } from "../../services/database/database-service";
import { ManifestEntity } from "../../models/manifest-entity";
import { Registrant } from "../../models/registrant";
import { ExecTimeService } from "../../services/exec-time/exec-time-service";
import { SpinnerService } from "../../services/utils/spinner-service";
import { ScanResult } from "../../models/scan-result";
import { BarcodeScanner, NFC } from "ionic-native";

/*
  Generated class for the Scan page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/

@Component({
  selector: 'page-scan',
  templateUrl: './scan.html'
})
export class ScanPage implements OnInit {
  randomCredentials: string[] = [];
  randomTickets: string[] = [];
  searchForm: FormGroup;
  scanResult: ScanResult; // the result of tha scan operation
  nfcReady: boolean = false;

  /**
   * @constructor
   * @param {ScanResultService} scanResultService
   * @param {ExecTimeService} execTimeService
   * @param {DatabaseService} database
   * @param {FormBuilder} builder
   * @param {App} app
   */
  constructor(private execTimeService: ExecTimeService,
              private database: DatabaseService,
              private builder: FormBuilder,
              private alertCtrl: AlertController,
              private toastCtrl: ToastController,
              private spinnerService: SpinnerService,
              private platform: Platform,
              private app: App) {
    this.searchForm = builder.group({
      'searchedDBString': ['', Validators.required]
    });
  }

  /**
   * Set random credentials and tickets
   */
  ngOnInit() {
    this.database.openDatabase()
      .then(() => {
        return Promise.all([
          this.database.selectRandomCredentials(),
          this.database.selectRandomTickets()
        ]);
      })
      .then(results => {
        this.randomCredentials = results[0];
        this.randomTickets = results[1];
      })
      .catch(err => {
        this.alertCtrl.create({
          title: 'ERROR',
          message: `Something goes wrong retrieving random db strings: ${err}`,
          buttons: [
            {
              text: 'Ok'
            }
          ]
        }).present();
      });
  }

  /**
   * Search for credential, ticket or both in the database
   * and redirect to scan result page
   * @param {string} dbString - the string to search
   * @param {string} type - the string type to search. It supports following values:
   *    - 'credential': search for a credential
   *    - 'ticket': search for a ticket
   *    - other values/no value: search for both credentials and tickets
   */
  search(dbString: string, type?: string): Promise<any> {
    this.scanResult = new ScanResult();
    this.scanResult.dbString = dbString;

    return this.spinnerService.createAndShow(
      'Wait for the DB search...'
    )
      .then(() => {
        return this.resolveSearch(dbString, type);
      })
      .then(time => {
        this.execTimeService.setTime('dbStringSearchTime', time);
        this.spinnerService.dismiss();

        this.goToScanResult();
        return;
      })
      .catch(err => {
        this.spinnerService.dismiss();
        this.alertCtrl.create({
          title: 'ERROR',
          message: `Something goes wrong during the search: ${err}`,
          buttons: [
            {
              text: 'Ok'
            }
          ]
        }).present();
      });
  }

  /**
   * Search for credential, ticket or both in the database
   * @param {string} dbString - the string to search
   * @param {string} type - the string type to search. It supports following values:
   *    - 'credential': search for a credential
   *    - 'ticket': search for a ticket
   *    - other values/no value: search for both credentials and tickets
   * @returns {Promise<number>} that resolves with the time to perform the search
   */
  resolveSearch(dbString: string, type?: string): Promise<number> {
    if(type == 'credential') {
      return this.searchForCredential(dbString);
    }
    if(type == 'ticket') {
      return this.searchForTicket(dbString);
    }

    let totalTime: number;
    return this.searchForCredential(dbString)
      .then(time => {
        totalTime = time;
        // If a credential is found, there is no need to
        // search for a ticket
        if(this.scanResult.manifest) {
          return 0;
        }
        return this.searchForTicket(dbString);
      })
      .then(time => {
        totalTime += time;
        return totalTime;
      });
  }

  /**
   * Search for a ticket in the database. It also searches for
   * credential and registrant linked to that ticket
   * @param {string} barcodeId - the barcode of the searched ticket
   * @returns {PromiseLike<number>} that resolves with the time to perform the ticket search
   */
  searchForTicket(barcodeId: string): Promise<number> {
    let time: number = this.execTimeService.startCounting();

    return this.database.searchForTicket(barcodeId)
      .then(ticket => {
        if(!ticket)
          return;

        // Update scan result
        this.scanResult.ticket = ticket;
        this.scanResult.isSearchSuccessful = true;
        // Searching for manifest and registrant linked to the ticket
        return Promise.all<ManifestEntity, Registrant>([
          this.database.searchForCredentialById(ticket.manifestId),
          this.database.searchForRegistrant(ticket.registrantId)
        ]);
      })
      .then(results => {
        if(results && results[0]) {
          this.scanResult.manifest = results[0];
        }
        if(results && results[1]) {
          this.scanResult.registrant = results[1];
        }
        return this.execTimeService.endCounting(time);
      });
  }

  /**
   * Read the barcode and search for a ticket
   * using the decoded text (barcode-id)
   * @returns {Promise<TResult|TResult>}
   */
  scanBarcode(): Promise<any> {
    return this.platform.ready()
      .then(() => BarcodeScanner.scan())
      .then(data => {
        if(data.text) {
          return this.search(data.text, 'ticket');
        }
        return;
      })
      .catch(err => {
        this.alertCtrl.create({
          title: 'ERROR',
          message: `Something goes wrong during barcode scan: ${err}`,
          buttons: [
            {
              text: 'Ok'
            }
          ]
        }).present();
      });
  }

  /**
   * Search for a credential in the database. It also searches for
   * ticket and registrant linked to that credential
   * @param {string} scanCode - the scan code of the searched credential
   * @returns {PromiseLike<number>} that resolves with the time to perform the credential search
   */
  searchForCredential(scanCode: string): Promise<number> {
    let time: number = this.execTimeService.startCounting();

    return this.database.searchForCredential(scanCode)
      .then(credential => {
        if(!credential)
          return;

        // Update scan result
        this.scanResult.manifest = credential;
        this.scanResult.isSearchSuccessful = true;

        // Searching for ticket linked to the credential
        return this.database.searchForTicketByManifestId(credential.manifestId);
      })
      .then(ticket => {
        if(!ticket)
          return;

        this.scanResult.ticket = ticket;
        // Searching for registrant linked to the credential
        return this.database.searchForRegistrant(ticket.registrantId);
      })
      .then(registrant => {
        if(registrant) {
          this.scanResult.registrant = registrant;
        }
        return this.execTimeService.endCounting(time);
      });
  }

  /**
   * Read the RFID tag and search for a credential
   * using the decoded text (scan-code)
   * @returns {Promise<any>}
   */
  scanRfid(): Promise<any> {
    return this.platform.ready()
      .then(() => {
        this.toastCtrl.create({
          message: 'Get the phone close to the RFID tag',
          duration: 2000
        }).present();

        return new Promise<any>((resolve, reject) => {
          this.nfcReady = true;

          NFC.addTagDiscoveredListener()
            .subscribe(
              res => resolve(res),
              err => reject(err)
            )
        });
      })
      .then(res => {
        return this.search(
          NFC.bytesToHexString(res.tag.id.reverse()),
          'credential'
        );
      })
      .then(() => {
        this.nfcReady = false;
        return;
      })
      .catch(err => {
        this.alertCtrl.create({
          title: 'ERROR',
          message: `Something goes wrong reading rfid tag: ${err}`,
          buttons: [
            {
              text: 'Ok'
            }
          ]
        }).present();
      });
  }

  /**
   * Navigate to scan result page
   * @param {string} dbString - string searched
   */
  goToScanResult() {
    this.app.getRootNav().push(
      ScanResultPage,
      this.scanResult,
      {animate: true, direction: 'forward'}
    );
  }

}
