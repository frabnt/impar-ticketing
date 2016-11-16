import { Component, ViewChild } from '@angular/core';
import { Slides } from "ionic-angular";
import { OrderTransaction } from "../../models/order-transaction";
import { ScanResultService } from "../../services/scan-result/scan-result-service";

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
  orderTransaction: OrderTransaction;

  /**
   * @constructor
   */
  constructor(private scanResultService: ScanResultService) {
    this.orderTransaction = this.scanResultService.getOrderTransaction();
  }

  /**
   * Navigate to next slide of slider component
   */
  nextSlide() {
    this.slider.slideNext(500);
  }

  /**
   * Navigate to previous slide of slider component
   */
  prevSlide() {
    this.slider.slidePrev(500);
  }

}
