import { Component, OnInit } from '@angular/core';
import { DatabaseService } from "../../services/database/database-service";
import { ExecTimeService } from "../../services/exec-time/exec-time-service";
import { AlertController } from "ionic-angular";

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
   * @param {DatabaseService} databaseService
   * @param {ExecTimeService} execTimeService
   */
  constructor(private databaseService: DatabaseService,
              private execTimeService: ExecTimeService,
              private alertCtrl: AlertController) {
    let manifestTime = execTimeService.getTime('manifestTime'),
         ticketsTime = execTimeService.getTime('ticketsTime');

    if(typeof manifestTime !== 'undefined')
      this.manifestTime = manifestTime;
    if(typeof ticketsTime !== 'undefined')
      this.ticketsTime = ticketsTime;
  }

  /**
   * Calculate stats using database service
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
        this.alertCtrl.create({
          title: 'Error',
          message: `Something goes wrong retrieving stats: ${err}`,
          buttons: [
            {
              text: 'Ok'
            }
          ]
        }).present();
      });
  }

}
