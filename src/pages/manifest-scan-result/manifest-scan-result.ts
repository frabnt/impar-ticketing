import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the ManifestScanResult page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-manifest-scan-result',
  templateUrl: 'manifest-scan-result.html'
})
export class ManifestScanResult {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello ManifestScanResult Page');
  }

}
