import { Component } from '@angular/core';
import { ScanResultService } from "../../services/scan-result/scan-result-service";
import { ManifestEntity } from "../../models/manifest-entity";
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
   * @param scanResultService
   */
  constructor(private scanResultService: ScanResultService) {
    this.manifest = scanResultService.getManifest();
  }

}
