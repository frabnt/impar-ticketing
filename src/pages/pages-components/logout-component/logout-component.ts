/**
 * Created by francesco on 16/10/2016.
 */
import { Component } from '@angular/core';
import { App, AlertController, Platform } from "ionic-angular";
import { LoginPage } from "../../login/login";
import { VfsApiService} from "../../../services/vfs-api/vfs-api-service";
import { DatabaseService } from "../../../services/database/database-service";
import { StatsService } from "../../../services/stats/stats-service";
import { SpinnerService } from "../../../services/spinner-service/spinner-service";

@Component({
  selector: 'logout',
  template:
    `
      <button ion-button clear (click)="logout()">
        <!-- <ion-icon name="log-out" class="larger-icon"></ion-icon> -->
        <ng-content></ng-content>
      </button>
    `
})
export class LogoutComponent {

  /**
   * @constructor
   * @param app
   * @param alertCtrl
   */
  constructor(private app: App,
              private alertCtrl: AlertController,
              private spinnerService: SpinnerService,
              private statsService: StatsService,
              private vfsApiService: VfsApiService,
              private database: DatabaseService,
              private platform: Platform){ }

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
            // loading spinner showed until logout procedure ends
            this.spinnerService.createSpinner({
              spinner: 'bubbles',
              content: 'Waiting for logout...',
            });
            this.spinnerService.presentSpinner();

            this.vfsApiService.doLogout()
              .then(() => {
                // Delete stored stats
                return this.statsService.resetStats();
              })
              .then(() => {
                return this.platform.ready();
              })
              .then(() => {
                // If platform is ready, database is deleted
                this.database.openDatabase();
                return this.database.clear();
              })
              .then(() => {
                this.spinnerService.dismissSpinner();
                this.app.getRootNav().setRoot(LoginPage, {},
                  {animate: true, direction: 'forward'});
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
