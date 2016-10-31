/**
 * Created by francesco on 16/10/2016.
 */
import { Component } from '@angular/core';
import { ViewController, App } from 'ionic-angular';

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
              private app: App) { }

  /**
   * Redirect to home page
   */
  goHome() {
    this.view.dismiss();
    this.app.getRootNav().pop();
  }

  /**
   * Dismiss the menu (e.g., useful when user click on logout)
   */
  dismissMenu() {
    this.view.dismiss();
  }
}
