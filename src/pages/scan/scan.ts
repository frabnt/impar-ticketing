import { Component } from '@angular/core';

/*
  Generated class for the Scan page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-scan',
  templateUrl: 'scan.html'
})
export class ScanPage {
  randomCredentials: string[];
  randomTickets: string[];

  constructor() {
    this.randomCredentials = ['c1', 'c2'];
    this.randomTickets = ['t1', 't2'];
  }

  search(dbString: string, type?: string) {

  }

}
