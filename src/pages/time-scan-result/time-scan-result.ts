import { Component } from '@angular/core';
import { ScanResultService } from "../../services/scan-result/scan-result-service";
import { NavParams } from "ionic-angular";

/*
  Generated class for the TimeScanResult page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-time-scan-result',
  templateUrl: 'time-scan-result.html'
})
export class TimeScanResultPage {
  searchTime: number;
  searchResult: boolean;
  resultImgUrl: string = 'assets/images/';

  /**
   * @constructor
   */
  constructor(private scanResultService: ScanResultService,
              private navParams: NavParams) {
    this.searchTime = navParams.get('searchTime');
    this.searchResult = scanResultService.isSearchSuccessful();
    this.resultImgUrl += this.searchResult ? 'success.png' : 'failure.png';
  }

}
