import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { VfsApiService } from "../../services/vfs-api/vfs-api-service";
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
  constructor(private navCtrl: NavController,
              private vfsApiService: VfsApiService) {}

  /**
   * If authenticated, the user is redirected to home page.
   * If not, the user is redirected to login page
   */
  ionViewDidLoad() {
    this.vfsApiService.getCredentials()
      .then((res) => {
        // If API token and event ID are set, user hasn't performed logout yet
        // so is currently authenticated
        if(res[0] && res[1]) {
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
