import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { App } from "ionic-angular";
import { ScanResultPage } from "../scan-result-tabs/scan-result-tabs";

/*
  Generated class for the Scan page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-scan',
  templateUrl: 'scan.html'
})
export class ScanPage {
  randomCredentials: string[];
  randomTickets: string[];
  searchForm: FormGroup;
  searchedDBString: string;

  /**
   * @constructor
   * @param builder
   * @param app
   */
  constructor(private builder: FormBuilder,
              private app: App) {
    this.randomCredentials = ['c1', 'c2'];
    this.randomTickets = ['t1', 't2'];

    this.searchForm = builder.group({
      'searchedDBString': ['', Validators.required]
    });
  }

  /**
   * Search for credential or ticket in the database
   * and redirect to scan result page
   * @param dbString
   * @param type
   */
  search(dbString: string, type?: string) {
    this.app.getRootNav().push(
      ScanResultPage,
      {dbString, type},
      {animate: true, direction: 'forward'}
    );
  }

}
