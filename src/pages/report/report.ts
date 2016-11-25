import { Component, OnInit } from '@angular/core';
import { DatabaseService } from "../../services/database/database-service";
import { ExecTimeService } from "../../services/exec-time/exec-time-service";

@Component({
  selector: 'page-report',
  templateUrl: 'report.html'
})
export class ReportPage implements OnInit {
  totalManifest: number = 0;
  totalTickets: number = 0;
  manifestTime: number = 0;
  ticketsTime: number = 0;

  /**
   * @constructor
   * @param loadingCtrl
   */
  constructor(private databaseService: DatabaseService,
              private execTimeService: ExecTimeService) {
    let manifestTime = execTimeService.getTime('manifestTime'),
         ticketsTime = execTimeService.getTime('ticketsTime');

    if(typeof manifestTime !== 'undefined')
      this.manifestTime = manifestTime;
    if(typeof ticketsTime !== 'undefined')
      this.ticketsTime = ticketsTime;
  }

  /**
   * Retrieve stats using stats-service
   */
  ngOnInit() {
    this.databaseService.openDatabase()
      .then(() => {
        return this.databaseService.calculateStats();
      })
      .then(stats => {
        this.totalManifest = stats[0];
        this.totalTickets = stats[1] + stats[2];
      })
      .catch(err => {
        console.error("Unable to retrieve stats.");
      });
  }

}
