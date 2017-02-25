import { Component } from '@angular/core';
import { NavParams } from "ionic-angular";
import { TimeScanResultPage } from "../time-scan-result/time-scan-result";
import { ManifestScanResultPage } from "../manifest-scan-result/manifest-scan-result";
import { TicketScanResultPage } from "../ticket-scan-result/ticket-scan-result";
import { RegistrantScanResultPage } from "../registrant-scan-result/registrant-scan-result";
import { ScanResult } from "../../models/scan-result";
/**
 * Created by francesco on 16/10/2016.
 */

@Component({
  templateUrl: './scan-result-tabs.html'
})
export class ScanResultPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = TimeScanResultPage;
  tab2Root: any;
  tab3Root: any;
  tab4Root: any;
  scanResult: ScanResult;

  /**
   * @constructor
   * @param {NavParams} navParams
   */
  constructor(private navParams: NavParams) {
    this.scanResult = navParams.data;

    if(this.scanResult.ticket) {
      this.tab2Root = TicketScanResultPage;
    }
    if(this.scanResult.manifest) {
      this.tab3Root = ManifestScanResultPage;
    }
    if(this.scanResult.registrant) {
      this.tab4Root = RegistrantScanResultPage;
    }
  }
}
