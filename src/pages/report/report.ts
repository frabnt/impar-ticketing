import { Component, OnInit } from '@angular/core';
import { ExecTimeService } from "../../services/exec-time/exec-time-service";
import { NavParams } from "ionic-angular";

@Component({
  selector: 'page-report',
  templateUrl: './report.html'
})
export class ReportPage implements OnInit {
  totalManifest: number = 0;
  totalTickets: number = 0;
  manifestTime: number = 0;
  ticketsTime: number = 0;

  /**
   * @constructor
   * @param {NavParams} navParams
   * @param {ExecTimeService} execTimeService
   */
  constructor(private navParams: NavParams,
              private execTimeService: ExecTimeService) { }

  /**
   * Retrieving stats, i.e. mapping time and
   * total number of entities (manifest and tickets)
   */
  ngOnInit() {
    // Retrieving time stats
    let manifestTime = this.execTimeService.getTime('manifestTime'),
      ticketsTime = this.execTimeService.getTime('ticketsTime');

    if(typeof manifestTime !== 'undefined')
      this.manifestTime = manifestTime;
    if(typeof ticketsTime !== 'undefined')
      this.ticketsTime = ticketsTime;

    // Retrieving total number of tickets and manifest
    this.totalManifest = this.navParams.get('totalManifest');
    this.totalTickets = this.navParams.get('totalTickets');
  }

}
