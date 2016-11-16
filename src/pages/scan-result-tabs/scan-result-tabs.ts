/**
 * Created by francesco on 16/10/2016.
 */
import { Component } from '@angular/core';

import { NavParams } from "ionic-angular";
import { TimeScanResultPage } from "../time-scan-result/time-scan-result";
import { ManifestScanResultPage } from "../manifest-scan-result/manifest-scan-result";
import { TicketScanResultPage } from "../ticket-scan-result/ticket-scan-result";
import { RegistrantScanResultPage } from "../registrant-scan-result/registrant-scan-result";
import { ScanResultService } from "../../services/scan-result/scan-result-service";

@Component({
  templateUrl: 'scan-result-tabs.html'
})
export class ScanResultPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = TimeScanResultPage;
  tab2Root: any;
  tab3Root: any;
  tab4Root: any;
  dbString: string;
  searchTime: number;

  /**
   * @constructor
   * @param navParams
   */
  constructor(private scanResultService: ScanResultService,
              private navParams: NavParams) {
    this.dbString = this.navParams.get('dbString');
    this.searchTime = this.navParams.get('searchTime');

    if(this.scanResultService.getOrderTransaction()) {
      this.tab2Root = TicketScanResultPage;
    }
    if(this.scanResultService.getManifest()) {
      this.tab3Root = ManifestScanResultPage;
    }
    if(this.scanResultService.getRegistrant()) {
      this.tab4Root = RegistrantScanResultPage;
    }
  }
}
