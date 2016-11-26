import { Component } from '@angular/core';
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
  tableTabs: string = 'tableTab1'; // table tabs
  orderTransaction: OrderTransaction;

  /**
   * @constructor
   * @param {ScanResultService} scanResultService
   */
  constructor(private scanResultService: ScanResultService) {
    this.orderTransaction = this.scanResultService.getOrderTransaction();
  }

}
