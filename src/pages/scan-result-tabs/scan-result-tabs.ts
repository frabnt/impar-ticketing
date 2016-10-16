/**
 * Created by francesco on 16/10/2016.
 */
import { Component } from '@angular/core';

import { NavParams } from "ionic-angular";

@Component({
  templateUrl: 'scan-result-tabs.html'
})
export class ScanResultPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any;
  tab2Root: any;
  tab3Root: any;
  dbString: string;
  type: string;

  constructor(private navParams: NavParams) {
    this.dbString = this.navParams.get('dbString');
    this.type = this.navParams.get('type');
  }
}
