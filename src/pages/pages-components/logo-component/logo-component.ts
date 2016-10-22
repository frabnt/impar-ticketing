/**
 * Created by francesco on 16/10/2016.
 */
import { Component } from '@angular/core';

@Component({
  selector: 'logo',
  template:
    `
      <ion-buttons>
        <img src="assets/images/logo-min.png" class="logo"/>
      </ion-buttons>
    `,
  styles: ['img{ margin-left: 15px }']
})
export class LogoComponent {

  constructor() { }

}
