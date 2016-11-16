/**
 * Created by francesco on 16/10/2016.
 */
import { Component } from '@angular/core';
import { App, AlertController, LoadingController, Platform } from "ionic-angular";
import { LoginPage } from "../../login/login";
import { VfsApiService} from "../../../services/vfs-api/vfs-api-service";
import { DatabaseService } from "../../../services/database/database-service";
import { CredentialsService } from "../../../services/credentials/credentials-service";

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
              private loadingCtrl: LoadingController,
              private credentialService: CredentialsService,
              private vfsApiService: VfsApiService,
              private database: DatabaseService,
              private platform: Platform){ }

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
            // loading spinner showed until logout procedure ends
            let loading = this.loadingCtrl.create({
              spinner: 'bubbles',
              content: 'Waiting for logout...',
            });
            loading.present();

            this.vfsApiService.doLogout()
              // If logout goes well, api token and event ID
              // are deleted from the storage
              .then(() => {
                return this.resetApiCredentials();
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
                loading.dismiss();
                this.app.getRootNav().setRoot(LoginPage, {},
                  {animate: true, direction: 'forward'});
              })
              .catch(err => {
                loading.dismiss();
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

  private resetApiCredentials(): Promise<any> {
    return Promise.all([
      this.credentialService.resetApiToken(),
      this.credentialService.resetEventID()
    ]);
  }
}
