import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from 'ionic-native';

import { LoginPage } from "../pages/login/login";
import { SettingsService } from "../providers/settings-service";
import { HomeTabs } from "../pages/home-tabs/tabs";


@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`
})
export class MyApp {
  rootPage;

  /**
   * @constructor
   * @param platform
   * @param settingsService
   */
  constructor(platform: Platform,
              private settingsService: SettingsService) {
    // Check if user is already logged and dynamically set root page
    this.settingsService.getLogged().then((res)=>{
      this.rootPage = res ? HomeTabs : LoginPage;
    });
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }
}
