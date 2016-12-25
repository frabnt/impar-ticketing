import { Component } from '@angular/core';
import { Registrant } from "../../models/registrant";
import { NavParams } from "ionic-angular";
/*
  Generated class for the RegistrantScanResult page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/

@Component({
  selector: 'page-registrant-scan-result',
  templateUrl: './registrant-scan-result.html'
})
export class RegistrantScanResultPage {
  registrant: Registrant;

  /**
   * @constructor
   * @param {ScanResultService} scanResultService
   */
  constructor(private navParams: NavParams) {
    this.registrant = navParams.get('registrant');
  }

}
