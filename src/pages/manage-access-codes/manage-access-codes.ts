import { Component } from '@angular/core';
import {NavParams, ViewController, AlertController} from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import {SettingsService} from "../../providers/settings-service";

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
  codeList: string[];
  numbers: number[];
  listModified: boolean;
  alreadySaved: boolean;

  constructor(private navParams: NavParams,
              private view: ViewController,
              private alertCtrl: AlertController,
              private settingsService: SettingsService) {
    this.codeList = this.navParams.get('codeList').slice(0);
    this.numbers = Array.from(
      Array(this.codeList.length),
      (x,i) => i );
  }

  save() {
    return this.settingsService.setAccessCodesList(this.codeList)
      .then(() => {
        this.alreadySaved = true;
      });
  }

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

  showEmptyFieldMessage() {
    this.alertCtrl.create({
      title: 'Error',
      message: "Input field cannot be empty",
      buttons: [
        {
          text: 'Got it!'
        }
      ]
    }).present();
  }

  exit() {
    if(this.alreadySaved) {
      this.view.dismiss(this.codeList);
    }
    else if(this.listModified) {
      this.showSavingConfirmation();
    }
    else {
      this.view.dismiss();
    }

  }

  updateState(event, i) {
    this.codeList[i] = event.target.value;
    this.setModified();
    this.resetAlreadySaved();
  }

  setModified() {
    if(!this.listModified)
      this.listModified = true;
  }

  resetAlreadySaved() {
    if(this.alreadySaved)
      this.alreadySaved = false;
  }

  deleteCode(index) {
    this.codeList.splice(index,1);
    this.numbers.pop();
    this.setModified();
    this.resetAlreadySaved();
  }

  addCode(newCode) {
    if(newCode) {
      this.codeList.push(newCode);
      this.numbers.push(this.numbers.length);
      this.setModified();
      this.resetAlreadySaved();
      return;
    }
    this.showEmptyFieldMessage();
  }

}
