import { Component } from '@angular/core';
import { NavParams } from "ionic-angular";
/**
 * Created by francesco on 16/10/2016.
 */

@Component({
  selector: 'search-info',
  template:
    `
      <ion-row>
        <ion-col class="header-font">
          Searched string
        </ion-col>
        <ion-col toggle-ellipsis>
          {{searchedDBString}}
        </ion-col>
      </ion-row>
      <hr>
    `
})
export class SearchInfoComponent {
  searchedDBString: string;

  /**
   * @constructor
   * @param {NavParams} navParams
   */
  constructor(private navParams: NavParams) {
    this.searchedDBString = this.navParams.get('dbString');
  }
}
