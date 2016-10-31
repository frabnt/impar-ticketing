import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the Welcome page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html'
})
export class WelcomePage {

  /**
   * @constructor
   * @param navCtrl
   */
  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {

  }

}
