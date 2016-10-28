/**
 * Created by francesco on 16/10/2016.
 */
import { Component } from '@angular/core';
import { ViewController, App, AlertController } from 'ionic-angular';
import { LoginPage } from "../login/login";
import { SettingsService } from "../../providers/settings-service";

@Component({
  selector: 'page-popover-menu',
  templateUrl: 'popover-menu.html'
})
export class PopoverMenu {

  /**
   * @constructor
   * @param view
   * @param app
   * @param alertCtrl
   */
  constructor(private view: ViewController,
              private app: App,
              private alertCtrl: AlertController,
              private settingsService: SettingsService) { }

  /**
   * Redirect to home page
   */
  goHome() {
    this.view.dismiss();
    this.app.getRootNav().pop();
  }

  /**
   * Show a confirmation alert and accomplish or not the
   * logout using authentication service basing on user choice
   */
  logout() {
    this.alertCtrl.create({
      title: 'Logout',
      message: 'Do you really want to log out?',
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Yes',
          handler: () => {
            this.settingsService.resetLogged()
              .then(() => {
                this.app.getRootNav().setRoot(LoginPage, {},
                  {animate: true, direction: 'forward'});
              });
          }
        }
      ]
    }).present()
      .then(() => this.view.dismiss());
  }
}
