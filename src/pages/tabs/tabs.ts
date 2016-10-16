import { Component } from '@angular/core';

import { ReportPage } from '../report/report';
import { ScanPage } from "../scan/scan";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = ReportPage;
  tab2Root: any = ScanPage;

  constructor() {

  }
}
