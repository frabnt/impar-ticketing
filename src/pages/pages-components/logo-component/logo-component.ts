/**
 * Created by francesco on 16/10/2016.
 */
import { Component } from '@angular/core';

@Component({
  selector: 'logo',
  template:
    `
      <ion-buttons>
        <img src="assets/images/vendini_logo.png" class="logo"/>
      </ion-buttons>
    `,
  styles:
    [`
      img { 
        margin-left: 15px; 
        width: 50px; 
        }
    `]
})
export class LogoComponent {

  /**
   * @constructor
   */
  constructor() { }

}
