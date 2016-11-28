import { Component } from '@angular/core';
import { ManifestEntity } from "../../models/manifest-entity";
import { NavParams } from "ionic-angular";
/*
  Generated class for the ManifestScanResult page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/

@Component({
  selector: 'page-manifest-scan-result',
  templateUrl: 'manifest-scan-result.html'
})
export class ManifestScanResultPage {
  tableTabs: string = 'tableTab1'; // table tabs
  manifest: ManifestEntity;

  /**
   * @constructor
   * @param {ScanResultService} scanResultService
   */
  constructor(private navParams: NavParams) {
    this.manifest = navParams.get('manifest');
  }

}
