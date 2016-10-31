import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SettingsService } from "../../providers/settings-service";
import { VfsApiService } from "../../providers/vfs-api-service";
import { HomeTabs } from "../home-tabs/tabs";
import { LoginPage } from "../login/login";

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
  constructor(public navCtrl: NavController,
              private settingsService: SettingsService,
              private vfsApiService: VfsApiService) {}

  ionViewDidLoad() {
    Promise.all([
      this.settingsService.getApiToken(),
      this.settingsService.getEventID()
    ])
      .then((res) => {
        if(res[0]) {
          this.vfsApiService.setCredentials(res[0], res[1]);
          this.navCtrl.setRoot(HomeTabs, {}, {animate: true, direction: 'forward'});
        }
        else {
          setTimeout(() => {
            this.navCtrl.setRoot(LoginPage, {}, {animate: true, direction: 'forward'});
          }, 1500);
        }
      })
      .catch(err => console.log(err));
  }

}
