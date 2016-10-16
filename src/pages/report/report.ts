import { Component } from '@angular/core';

import { LoadingController } from 'ionic-angular';

@Component({
  selector: 'page-report',
  templateUrl: 'report.html'
})
export class ReportPage {
  totalManifest: number;

  constructor(private loadingCtrl: LoadingController) {
    this.totalManifest = 85000;

    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Waiting for login...',
      duration: 3000
    });

    loading.present();
  }

}
