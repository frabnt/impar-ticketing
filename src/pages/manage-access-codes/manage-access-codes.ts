import { Component } from '@angular/core';
import { NavParams, ViewController, AlertController } from 'ionic-angular';
import { SettingsService } from "../../services/settings/settings-service";

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
            this.save();
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
   * Save access codes list in the storage
   */
  save() {
    this.settingsService.setAccessCodesList(this.codeList)
      .then(() => {
        this.view.dismiss(this.codeList);
      })
      .catch(err => {
        this.alertCtrl.create({
          title: 'Error',
          message: 'Something goes wrong saving settings.',
          buttons: [
            {
              text: 'Ok'
            }
          ]
        }).present();
        this.view.dismiss();
      });
  }

  /**
   * Exit from modal window
   */
  exit() {
    if(this.listModified) { //if codes list has been modified, it's showed a saving confirmation message
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
  }

  /**
   * Set listModified var to true
   */
  setModified() {
    if(!this.listModified)
      this.listModified = true;
  }

  /**
   * Delete an access code from code list
   * @param {number} index - index of code to be deleted from codeList array
   */
  deleteCode(index: number) {
    this.codeList.splice(index,1);
    this.numbers.pop();
    // now codes list is modified so changes need to be saved
    this.setModified();
  }

  /**
   * Add an access code to code list
   * @param {string} newCode - code to be added
   */
  addCode(newCode: string) {
    this.codeList.push(newCode);
    this.numbers.push(this.numbers.length);
    this.setModified();
  }

}
