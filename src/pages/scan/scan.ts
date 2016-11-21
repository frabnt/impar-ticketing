import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { App, Platform } from "ionic-angular";
import { ScanResultPage } from "../scan-result-tabs/scan-result-tabs";
import { ScanResultService } from "../../services/scan-result/scan-result-service";
import { DatabaseService } from "../../services/database/database-service";
import { Deserialize } from "cerialize";
import { ManifestEntity } from "../../models/manifest-entity";
import { OrderTransaction } from "../../models/order-transaction";
import { Registrant } from "../../models/registrant";
import { ExecTimeService } from "../../services/exec-time/exec-time-service";

/*
  Generated class for the Scan page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-scan',
  templateUrl: 'scan.html'
})
export class ScanPage implements OnInit {
  randomCredentials: string[] = [];
  randomTickets: string[] = [];
  searchForm: FormGroup;
  searchedDBString: string;

  /**
   * @constructor
   * @param builder
   * @param app
   */
  constructor(private scanResultService: ScanResultService,
              private execTimeService: ExecTimeService,
              private database: DatabaseService,
              private builder: FormBuilder,
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
    this.platform.ready()
      .then(() => {
        this.database.openDatabase();
        this.setRandomDBStrings();
      });
  }

  /**
   * Set random credentials and tickets retrieving
   * them from the database
   */
  setRandomDBStrings() {
    this.database.selectRandomCredentials()
      .then((result) => {
        this.randomCredentials = result;
      });
    this.database.selectRandomTickets()
      .then((result) => {
        this.randomTickets = result;
      });
  }

  /**
   * Search for credential, ticket or both in the database
   * and redirect to scan result page
   * @param dbString - the string to search
   * @param type - the string type to search. It supports following values:
   *    - 'credential': search for a credential
   *    - 'ticket': search for a ticket
   *    - other values/no value: search for both credentials and tickets
   */
  search(dbString: string, type?: string) {
    this.resolveSearch(dbString, type)
      .then((time) => {
        this.goToScanResult(dbString, time);
      }).catch(err => console.log(err));
  }

  /**
   * Search for credential, ticket or both in the database
   * @param dbString - the string to search
   * @param type - the string type to search. It supports following values:
   *    - 'credential': search for a credential
   *    - 'ticket': search for a ticket
   *    - other values/no value: search for both credentials and tickets
   * @returns {PromiseLike<number>} - time to perform the search
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
      .then((time) => {
        totalTime = time;
        // If a credential is found, there is no need to
        // search for a ticket
        if(this.scanResultService.getOrderTransaction()) {
          return 0;
        }
        return this.searchForTicket(dbString);
      })
      .then((time) => {
        totalTime += time;
        return totalTime;
      });
  }

  /**
   * Search for a ticket in the database. It also searches for
   * credential and registrant linked to the ticket
   * @param ticketId - the ticket to search
   * @returns {PromiseLike<number>} - time to perform the search
   */
  searchForTicket(ticketId: string): Promise<number> {
    let time: number = this.execTimeService.startCounting();

    return this.database.searchForTicket(ticketId)
      .then((result) => {
        if(!result.res.rows.length)
          return;

        let orderTransaction: OrderTransaction = Deserialize(
          result.res.rows.item(0),
          OrderTransaction
        );
        this.scanResultService.setOrderTransaction(orderTransaction);
        this.scanResultService.setSearchSuccessful();

        // Searching for manifest and registrant linked to the ticket
        return Promise.all([
          this.database.searchForCredential(orderTransaction.manifestId),
          this.database.searchForRegistrant(orderTransaction.registrantId)
        ]);
      })
      .then((results) => {
        if(results && results[0].res.rows.length) {
          this.scanResultService.setManifest(
            Deserialize(results[0].res.rows.item(0), ManifestEntity)
          );
        }
        if(results && results[1].res.rows.length) {
          this.scanResultService.setRegistrant(
            Deserialize(results[1].res.rows.item(0), Registrant)
          );
        }
        return this.execTimeService.endCounting(time);
      });
  }

  /**
   * Search for a credential in the database. It also searches for
   * ticket and registrant linked to the credential
   * @param credentialId - the credential to search
   * @returns {PromiseLike<number>} - time to perform the search
   */
  searchForCredential(credentialId: string): Promise<number> {
    let time: number = this.execTimeService.startCounting();

    return this.database.searchForCredential(credentialId)
      .then((result) => {
        if(!result.res.rows.length)
          return;

        let manifest: ManifestEntity = Deserialize(
          result.res.rows.item(0),
          ManifestEntity
        );
        this.scanResultService.setManifest(manifest);
        this.scanResultService.setSearchSuccessful();

        // Searching for ticket linked to the credential
        return this.database.searchForTicketByManifestId(manifest.manifestId);
      })
      .then((result) => {
        if(!result || !result.res.rows.length)
          return;

        let orderTransaction: OrderTransaction = Deserialize(
          result.res.rows.item(0),
          OrderTransaction
        );
        this.scanResultService.setOrderTransaction(orderTransaction);

        // Searching for registrant linked to the credential
        return this.database.searchForRegistrant(orderTransaction.registrantId);
      })
      .then((result) => {
        if(result && result.res.rows.length) {
          this.scanResultService.setRegistrant(
            Deserialize(result.res.rows.item(0), Registrant)
          );
        }

        return this.execTimeService.endCounting(time);
      });
  }

  /**
   * Navigate to scan result page
   * @param dbString - string searched
   * @param searchTime - time to perform the search
   */
  goToScanResult(dbString: string, searchTime: number) {
    this.app.getRootNav().push(
      ScanResultPage,
      {dbString, searchTime},
      {animate: true, direction: 'forward'}
    );
  }

}
