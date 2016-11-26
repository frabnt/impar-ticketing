import { Component } from '@angular/core';
import { App, AlertController } from "ionic-angular";
import { LoginPage } from "../../login/login";
import { VfsApiService} from "../../../services/vfs-api/vfs-api-service";
import { DatabaseService } from "../../../services/database/database-service";
import { SpinnerService } from "../../../services/utils/spinner-service";
/**
 * Created by francesco on 16/10/2016.
 */

@Component({
  selector: 'logout',
  template:
    `
      <button ion-button clear (click)="logout()">
        <ng-content></ng-content>
      </button>
    `
})
export class LogoutComponent {

  /**
   *
   * @param {App} app
   * @param {AlertController} alertCtrl
   * @param {SpinnerService} spinnerService
   * @param {VfsApiService} vfsApiService
   * @param {DatabaseService} database
   */
  constructor(private app: App,
              private alertCtrl: AlertController,
              private spinnerService: SpinnerService,
              private vfsApiService: VfsApiService,
              private database: DatabaseService){ }

  /**
   * Show a confirmation alert and accomplish or not the
   * logout basing on user choice
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
            // loading spinner showed until logout ends
            this.spinnerService.createSpinner({
              spinner: 'bubbles',
              content: 'Waiting for logout...',
            });
            this.spinnerService.presentSpinner();

            this.vfsApiService.doLogout()
              .then(() => {
                return this.database.openDatabase();
              })
              .then(() => {
                // Once opened, the database is deleted
                return this.database.clear();
              })
              .then(() => {
                this.spinnerService.dismissSpinner();
                this.app.getRootNav().setRoot(
                  LoginPage,
                  {},
                  {animate: true, direction: 'forward'}
                );
              })
              .catch(err => {
                this.spinnerService.dismissSpinner();
                // If logout goes wrong, an error message is displayed
                this.alertCtrl.create({
                  title: 'Logout error',
                  message: 'Error! Something goes wrong during logout.',
                  buttons: [
                    {
                      text: 'Ok'
                    }
                  ]
                }).present();
              });
          }
        }
      ]
    }).present();
  }

}
