import { Injectable } from '@angular/core';
import { LoadingController, Loading } from "ionic-angular";
/*
  Generated class for the SpinnerService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

@Injectable()
export class SpinnerService {
  private spinner: Loading;
  // spinner content
  private content: string;

  /**
   * @constructor
   * @param {LoadingController} loadingCtrl
   */
  constructor(private loadingCtrl: LoadingController) { }

  /**
   * Create a new loading spinner
   * @param {string} spinner: the name of the svg spinner for the loading indicator
   * @param {string} content: the html content for the loading spinner
   */
  create(content: string, spinner: string = 'crescent') {
    this.spinner = this.loadingCtrl.create({
      spinner: spinner,
      content: content
    });
    this.content = content;
  }

  /**
   * Create and show a loading spinner
   * @param {string} spinner: the name of the svg spinner for the loading indicator
   * @param {string} content: the html content for the loading spinner
   */
  createAndShow(content: string, spinner: string = 'crescent') {
    this.create(content, spinner);
    this.present();
  }

  /**
   * Set the spinner textual content
   * @param {string} content - the text to insert
   */
  setContent(content: string) {
    if(this.spinner) {
      this.spinner.setContent(content);
      this.content = content;
    }
  }

  /**
   * @returns {string} - the spinner content
   */
  getContent(): string {
    return this.content;
  }

  /**
   * Concatenate spinner content with the given string
   * @param newContent - the string to concatenate
   */
  concatContent(newContent: string) {
    this.spinner.setContent(
      this.getContent() + newContent
    );
  }

  /**
   * Present the spinner
   * @param {NavOptions} navOptions - nav options to go with this transition
   */
  present() {
    if(this.spinner) {
      this.spinner.present();
    }
  }

  /**
   * Dismiss the spinner
   */
  dismiss() {
    if(this.spinner) {
      this.spinner.dismiss();
    }
  }

}
