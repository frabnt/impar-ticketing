/**
 * Created by francesco on 16/10/2016.
 */
import { Component } from '@angular/core';
import { ViewController, App } from 'ionic-angular';
import { HomeTabs } from "../home-tabs/tabs";
import { ScanResultService } from "../../services/scan-result/scan-result-service";

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
  constructor(private scanResultService: ScanResultService,
              private view: ViewController,
              private app: App) { }

  /**
   * Redirect to home page
   */
  goHome() {
    this.dismissMenu();
    this.app.getRootNav().setRoot(
      HomeTabs,
      {},
      {animate: true, direction: 'forward'}
    );
  }

  /**
   * Dismiss the menu (e.g., useful when user click on logout)
   */
  dismissMenu() {
    this.scanResultService.resetAll();
    this.view.dismiss();
  }
}
