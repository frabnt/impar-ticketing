import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { App, AlertController } from "ionic-angular";
import { ScanResultPage } from "../scan-result-tabs/scan-result-tabs";
import { DatabaseService } from "../../services/database/database-service";
import { ManifestEntity } from "../../models/manifest-entity";
import { Registrant } from "../../models/registrant";
import { ExecTimeService } from "../../services/exec-time/exec-time-service";
import { SpinnerService } from "../../services/utils/spinner-service";
import { ScanResult } from "../../models/scan-result";
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
              private spinnerService: SpinnerService,
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
          title: 'Error',
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
  search(dbString: string, type?: string) {
    this.spinnerService.createAndShow(
      'Wait for the DB search...'
    );

    this.scanResult = new ScanResult();
    this.scanResult.dbString = dbString;

    this.resolveSearch(dbString, type)
      .then(time => {
        this.execTimeService.setTime('dbStringSearchTime', time);
        this.spinnerService.dismiss();
        this.goToScanResult();
      })
      .catch(err => {
        this.spinnerService.dismiss();
        this.alertCtrl.create({
          title: 'Error',
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
   * @param {string} ticketId - the ticket to search
   * @returns {PromiseLike<number>} that resolves with the time to perform the ticket search
   */
  searchForTicket(ticketId: string): Promise<number> {
    let time: number = this.execTimeService.startCounting();

    return this.database.searchForTicket(ticketId)
      .then(ticket => {
        if(!ticket)
          return;

        // Update scan result
        this.scanResult.ticket = ticket;
        this.scanResult.isSearchSuccessful = true;
        // Searching for manifest and registrant linked to the ticket
        return Promise.all<ManifestEntity, Registrant>([
          this.database.searchForCredential(ticket.manifestId),
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
   * Search for a credential in the database. It also searches for
   * ticket and registrant linked to that credential
   * @param {string} credentialId - the credential to search
   * @returns {PromiseLike<number>} that resolves with the time to perform the credential search
   */
  searchForCredential(credentialId: string): Promise<number> {
    let time: number = this.execTimeService.startCounting();

    return this.database.searchForCredential(credentialId)
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
