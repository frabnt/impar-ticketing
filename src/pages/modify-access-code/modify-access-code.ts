import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

/*
  Generated class for the ModifyAccessCode page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-modify-access-code',
  templateUrl: 'modify-access-code.html'
})
export class ModifyAccessCodePage {
  accessCode: string;
  accessCodeForm: FormGroup;

  constructor(private navParams: NavParams,
              private builder: FormBuilder,
              private view: ViewController) {
    this.accessCode = this.navParams.get('code');
    this.accessCodeForm = builder.group({
      'accessCode': ['', Validators.required]
    });
  }

  close() {
    this.view.dismiss();
  }

  submit() {
    this.view.dismiss(this.accessCode);
  }

}
