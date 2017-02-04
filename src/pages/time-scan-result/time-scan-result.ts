import { Component, trigger, state, style, transition, animate, keyframes } from '@angular/core';
import { ExecTimeService } from "../../services/exec-time/exec-time-service";
import { NavParams } from "ionic-angular";
/*
  Generated class for the TimeScanResult page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/

@Component({
  selector: 'page-time-scan-result',
  templateUrl: './time-scan-result.html',
  animations: [
    trigger('bounce', [
      state('bouncing', style({
        transform: 'translate3d(0,0,0)'
      })),
      transition('* => bouncing', [
        animate('1000ms ease-in', keyframes([
          style({transform: 'translate3d(0,-100%,0)', offset: 0, opacity: 0}),
          style({transform: 'translate3d(0,-100%,0)', offset: 0.05, opacity: 0}),
          //first bounce
          style({transform: 'translate3d(0,0,0)', offset: 0.15, paddingBottom: '5px'}),
          style({transform: 'translate3d(0,-50%,0)', offset: 0.30}),
          //second bounce
          style({transform: 'translate3d(0,-30%,0)', offset: 0.5}),
          //continously bouncing until stop
          style({transform: 'translate3d(0,0,0)', offset: 0.7, paddingBottom: '7px'}),
          style({transform: 'translate3d(0,-15%,0)', offset: 0.8}),
          style({transform: 'translate3d(0,0,0)', offset: 0.9, paddingBottom: '8px'}),
          style({transform: 'translate3d(0,-7%,0)', offset: 0.95}),
          style({transform: 'translate3d(0,0,0)', offset: 0.97, paddingBottom: '9px'}),
          style({transform: 'translate3d(0,-3%,0)', offset: 0.99}),
          style({transform: 'translate3d(0,0,0)', offset: 1, paddingBottom: '9px', opacity: 1})
        ]))
      ])
    ])
  ]
})
export class TimeScanResultPage {
  searchTime: number;
  searchResult: boolean;
  resultImgUrl: string = 'assets/images/';

  /**
   * @constructor
   * @param {ExecTimeService} execTimeService
   * @param {ScanResultService} scanResultService
   */
  constructor(private execTimeService: ExecTimeService,
              private navParams: NavParams) {
    this.searchTime = execTimeService.getTime('dbStringSearchTime');
    this.searchResult = navParams.get('searchSuccessful');
    this.resultImgUrl += this.searchResult ? 'success.png' : 'failure.png';
  }

}
