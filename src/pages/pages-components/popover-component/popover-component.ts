/**
 * Created by francesco on 16/10/2016.
 */
import { Component } from '@angular/core';
import { PopoverController } from "ionic-angular";
import { PopoverMenu } from "../../popover-menu/popover-menu";

@Component({
  selector: 'popover',
  template: `
      <button ion-button clear
              (click)="presentPopover($event)">
        <ion-icon name="more" class="larger-icon"></ion-icon>
      </button>
    `,
  styles: ["ion-icon {color: #424242}"]
})
export class PopoverComponent {

  constructor(private popoverCtrl: PopoverController) { }

  presentPopover() {
    this.popoverCtrl.create(PopoverMenu).present({ev: event});
  }
}
