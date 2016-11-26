import { Injectable } from '@angular/core';
import {
  LoadingController,
  LoadingOptions,
  Loading,
  NavOptions
} from "ionic-angular";
/*
  Generated class for the SpinnerService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

@Injectable()
export class SpinnerService {
  private spinner: Loading;

  /**
   * @constructor
   * @param {LoadingController} loadingCtrl
   */
  constructor(private loadingCtrl: LoadingController) { }

  /**
   * Create a new loading spinner with the given options
   * @param {LoadingOptions} options - support following optional fields:
   *  {
   *    - {string} spinner: the name of the svg spinner for the loading indicator
   *    - {string} content: the html content for the loading indicato
   *    - {string} cssClass: additional classes for custom styles, separated by spaces
   *    - {boolean} showBackdrop: whether to show the backdrop (default true)
   *    - {boolean} dismissOnPageChange: whether to dismiss the indicator when navigating
    *                                    to a new page (default false)
   *    - {number} duration: how many milliseconds to wait before hiding the indicator.
   *                         By default, it will show until dismiss() is called.
   *  }
   */
  createSpinner(options: LoadingOptions) {
    this.spinner = this.loadingCtrl.create(options);
  }

  /**
   * Set the spinner textual content
   * @param {string} content - the text to insert
   */
  setSpinnerContent(content: string) {
    if(this.spinner) {
      this.spinner.setContent(content);
    }
  }

  /**
   * Present the spinner
   * @param {NavOptions} navOptions - nav options to go with this transition
   */
  presentSpinner(navOptions?: NavOptions) {
    if(this.spinner) {
      this.spinner.present(navOptions);
    }
  }

  /**
   * Dismiss the spinner
   * @param {any} data - the data to transmit dissming the spinner
   * @param {any} role - a role property to attach to the spinner
   * @param {NavOptions} navOptions - nav options to go with this transition
   */
  dismissSpinner(data?: any, role?: any, navOptions?: NavOptions ) {
    if(this.spinner) {
      this.spinner.dismiss(
        data,
        role,
        navOptions
      );
    }
  }

}
