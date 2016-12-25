import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { HomeTabs } from "../home-tabs/tabs";
import { LoginPage } from "../login/login";
/*
  Generated class for the Welcome page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/

@Component({
  selector: 'page-welcome',
  templateUrl: './welcome.html'
})
export class WelcomePage {

  /**
   * @constructor
   * @param {NavController} navCtrl
   * @param {Platform} platform
   * @param {LocalStorageService} storageService
   */
  constructor(private navCtrl: NavController,
              private platform: Platform,
              private storageService: Storage) {}

  /**
   * If authenticated, the user is redirected to home page.
   * If not, the user is redirected to login page
   */
  ionViewDidLoad() {
    this.platform.ready()
      .then(() => {
        return Promise.all([
          this.storageService.get('apiToken'),
          this.storageService.get('eventID')
        ]);
      })
      .then(res => {
        // If API token and event ID are set, user hasn't performed logout yet
        // so is currently authenticated
        if(res[0] && res[1]) {
          this.navCtrl.setRoot(
            HomeTabs,
            {},
            { animate: true, direction: 'forward' }
          );
        }
        else {
          this.navCtrl.setRoot(
            LoginPage,
            {},
            { animate: true, direction: 'forward' }
          );
        }
      })
      .catch(err => console.log(err));
  }

}
