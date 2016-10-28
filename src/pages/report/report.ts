import { Component } from '@angular/core';

@Component({
  selector: 'page-report',
  templateUrl: 'report.html'
})
export class ReportPage {
  totalManifest: number;

  /**
   * @constructor
   * @param loadingCtrl
   */
  constructor() {
    this.totalManifest = 85000;
  }

}
