/**
 * Created by francesco on 16/10/2016.
 */
import { Component } from '@angular/core';
import { NavParams } from "ionic-angular";

@Component({
  selector: 'search-info',
  template: `
      <ion-row>
        <ion-col >
          Searched string
        </ion-col>
        <ion-col>{{searchedDBString}}</ion-col>
      </ion-row>
      <hr>
    `
})
export class SearchInfoComponent {
  searchedDBString: string;

  constructor(private navParams: NavParams) {
    this.searchedDBString = this.navParams.get('dbString');
  }
}