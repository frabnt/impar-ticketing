/**
 * Created by francesco on 16/10/2016.
 */
import { Component } from '@angular/core';

import { NavParams } from "ionic-angular";
import { TimeScanResultPage } from "../time-scan-result/time-scan-result";
import { ManifestScanResultPage } from "../manifest-scan-result/manifest-scan-result";
import { TicketScanResultPage } from "../ticket-scan-result/ticket-scan-result";
import { RegistrantScanResultPage } from "../registrant-scan-result/registrant-scan-result";

@Component({
  templateUrl: 'scan-result-tabs.html'
})
export class ScanResultPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = TimeScanResultPage;
  tab2Root: any = TicketScanResultPage;
  tab3Root: any = ManifestScanResultPage;
  tab4Root: any = RegistrantScanResultPage;
  dbString: string;
  type: string;

  /**
   * @constructor
   * @param navParams
   */
  constructor(private navParams: NavParams) {
    this.dbString = this.navParams.get('dbString');
    this.type = this.navParams.get('type');
  }
}
