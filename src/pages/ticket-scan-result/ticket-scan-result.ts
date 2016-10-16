import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the TicketScanResult page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-ticket-scan-result',
  templateUrl: 'ticket-scan-result.html'
})
export class TicketScanResult {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello TicketScanResult Page');
  }

}
