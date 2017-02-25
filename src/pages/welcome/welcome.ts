import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { HomeTabs } from "../home-tabs/tabs";
import { LoginPage } from "../login/login";
import { DatabaseService } from "../../services/database/database-service";
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
   * @param {DatabaseService} databaseService
   * @param {Storage} storageService
   */
  constructor(private navCtrl: NavController,
              private platform: Platform,
              private databaseService: DatabaseService,
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
          // Retrieving stats need to be passed to Report page
          return this.databaseService.openDatabase()
            .then(() => {
              return this.databaseService.calculateStats();
            })
            .then(stats => {
              return this.navCtrl.setRoot(
                HomeTabs,
                { totalManifest: stats[0], totalTickets: stats[1] },
                { animate: true, direction: 'forward' }
              );
            });
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
