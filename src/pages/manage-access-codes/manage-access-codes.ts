import { Component } from '@angular/core';
import { NavParams, ViewController, AlertController } from 'ionic-angular';
import { SettingsService } from "../../providers/settings-service";

/*
  Generated class for the ModifyAccessCode page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-manage-access-code',
  templateUrl: 'manage-access-codes.html'
})
export class ModifyAccessCodePage {
  codeList: string[]; //it store access code list
  numbers: number[]; //used to keep track of codeList length
  listModified: boolean; //it's true if access code list has been modified
  alreadySaved: boolean; //it's true if the user has already saved

  /**
   * @constructor
   * @param navParams
   * @param view
   * @param alertCtrl
   * @param localSettings
   */
  constructor(private navParams: NavParams,
              private view: ViewController,
              private alertCtrl: AlertController,
              private settingsService: SettingsService) {
    this.codeList = this.navParams.get('codeList').slice(0); //assign to codeList a copy of access codes list (that's why is used slice)
    this.numbers = Array.from( //store as many integers (0,1,2,..,codeList.length-1) as the length of codeList
      Array(this.codeList.length),
      (x,i) => i
    );
  }

  /**
   * Save access codes list in the storage
   * @returns {Promise<T>}
   */
  save() {
    return this.settingsService.setAccessCodesList(this.codeList)
      .then(() => {
        this.alreadySaved = true;
      });
  }

  /**
   * Show saving confirmation alert
   */
  showSavingConfirmation() {
    this.alertCtrl.create({
      title: 'Save',
      message: "Do you want to save?",
      buttons: [
        {
          text: 'Save',
          handler: () => {
            this.save().then(() => {
              this.view.dismiss(this.codeList);
            });
          }
        },
        {
          text: 'No',
          handler: () => {
            this.view.dismiss();
          }
        }
      ]
    }).present();
  }

  /**
   * Exit from modal window
   */
  exit() {
    if(this.alreadySaved) { //if user has saved, the view is dismissed passing the new code list to parent page
      this.view.dismiss(this.codeList);
    }
    else if(this.listModified) { //if user has not saved and code list has been modified, it's showed a saving confirmation message
      this.showSavingConfirmation();
    }
    else { //if code list has not been modified, the view is dismissed passing nothing to parent page
      this.view.dismiss();
    }

  }

  /**
   * Update code list values when user modifies them through input fields
   * @param event
   * @param i
   */
  updateState(event, i) {
    this.codeList[i] = event.target.value;
    // now codes list is modified so changes need to be saved
    this.setModified();
    this.resetAlreadySaved();
  }

  /**
   * Set listModified var to true
   */
  setModified() {
    if(!this.listModified)
      this.listModified = true;
  }

  /**
   * Set alreadySaved var to true
   */
  resetAlreadySaved() {
    if(this.alreadySaved)
      this.alreadySaved = false;
  }

  /**
   * Delete an access code from code list
   * @param index - index of code to be deleted from codeList array
   */
  deleteCode(index: number) {
    this.codeList.splice(index,1);
    this.numbers.pop();
    // now codes list is modified so changes need to be saved
    this.setModified();
    this.resetAlreadySaved();
  }

  /**
   * Add an access code to code list
   * @param newCode {string} - code to be added
   */
  addCode(newCode: string) {
    this.codeList.push(newCode);
    this.numbers.push(this.numbers.length);
    this.setModified();
    this.resetAlreadySaved();
  }

}
