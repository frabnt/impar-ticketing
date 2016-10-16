/**
 * Created by francesco on 16/10/2016.
 */
import { Component } from '@angular/core';
import { ViewController, App, AlertController } from 'ionic-angular';
import { LoginPage } from "../login/login";

@Component({
  selector: 'page-popover-menu',
  templateUrl: 'popover-menu.html'
})
export class PopoverMenu {

  constructor(private view: ViewController,
              private app: App,
              private alertCtrl: AlertController) {}

  goHome() {
    this.view.dismiss();
    this.app.getRootNav().pop();
  }

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
            this.app.getRootNav().setRoot(LoginPage, {},
              {animate: true, direction: 'forward'});
          }
        }
      ]
    }).present()
      .then(() => this.view.dismiss());
  }
}
