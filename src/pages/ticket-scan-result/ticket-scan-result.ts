import { Component, ViewChild } from '@angular/core';
import { Slides } from "ionic-angular";

/*
  Generated class for the TicketScanResult page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-ticket-scan-result',
  templateUrl: 'ticket-scan-result.html'
})
export class TicketScanResultPage {
  @ViewChild('mySlider') slider: Slides;

  constructor() {
  }

  nextSlide() {
    this.slider.slideNext(500);
  }

  prevSlide() {
    this.slider.slidePrev(500);
  }

}
