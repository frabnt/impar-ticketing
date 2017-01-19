import { Component, OnInit } from '@angular/core';
import { ReportPage } from '../report/report';
import { ScanPage } from "../scan/scan";
import { NavParams } from "ionic-angular";

@Component({
  templateUrl: './tabs.html'
})
export class HomeTabs implements OnInit {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = ReportPage;
  tab2Root: any = ScanPage;
  totalManifest: number = 0;
  totalTickets: number = 0;

  /**
   * @constructor
   */
  constructor(private navParams: NavParams) { }

  /**
   * Retrieve mapping times need to be passed to Report page
   */
  ngOnInit() {
    this.totalManifest = this.navParams.get('totalManifest');
    this.totalTickets = this.navParams.get('totalTickets');
  }
}
