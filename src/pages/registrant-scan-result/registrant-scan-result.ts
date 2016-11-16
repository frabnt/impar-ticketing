import { Component } from '@angular/core';
import { Registrant } from "../../models/registrant";
import { ScanResultService } from "../../services/scan-result/scan-result-service";

/*
  Generated class for the RegistrantScanResult page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-registrant-scan-result',
  templateUrl: 'registrant-scan-result.html'
})
export class RegistrantScanResultPage {
  registrant: Registrant;

  /**
   * @constructor
   * @param navCtrl
   */
  constructor(private scanResultService: ScanResultService) {
    this.registrant = scanResultService.getRegistrant();
  }

}
