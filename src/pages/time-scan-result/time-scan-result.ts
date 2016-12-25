import { Component } from '@angular/core';
import { ExecTimeService } from "../../services/exec-time/exec-time-service";
import { NavParams } from "ionic-angular";
/*
  Generated class for the TimeScanResult page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/

@Component({
  selector: 'page-time-scan-result',
  templateUrl: './time-scan-result.html'
})
export class TimeScanResultPage {
  searchTime: number;
  searchResult: boolean;
  resultImgUrl: string = 'assets/images/';

  /**
   * @constructor
   * @param {ExecTimeService} execTimeService
   * @param {ScanResultService} scanResultService
   */
  constructor(private execTimeService: ExecTimeService,
              private navParams: NavParams) {
    this.searchTime = execTimeService.getTime('dbStringSearchTime');
    this.searchResult = navParams.get('searchSuccessful');
    this.resultImgUrl += this.searchResult ? 'success.png' : 'failure.png';
  }

}
