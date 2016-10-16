/**
 * Created by francesco on 16/10/2016.
 */
import { Component } from '@angular/core';

import { NavParams } from "ionic-angular";
import { TimeScanResult } from "../time-scan-result/time-scan-result";
import { ManifestScanResult } from "../manifest-scan-result/manifest-scan-result";
import { TicketScanResult } from "../ticket-scan-result/ticket-scan-result";

@Component({
  templateUrl: 'scan-result-tabs.html'
})
export class ScanResultPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = TimeScanResult;
  tab2Root: any = ManifestScanResult;
  tab3Root: any = TicketScanResult;
  dbString: string;
  type: string;

  constructor(private navParams: NavParams) {
    this.dbString = this.navParams.get('dbString');
    this.type = this.navParams.get('type');
  }
}
