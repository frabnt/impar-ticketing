import { Component, OnInit } from '@angular/core';
import { Stats } from "../../models/stats";
import { StatsService } from "../../services/stats/stats-service";

@Component({
  selector: 'page-report',
  templateUrl: 'report.html'
})
export class ReportPage implements OnInit {
  stats: Stats = new Stats();

  /**
   * @constructor
   * @param loadingCtrl
   */
  constructor(private statsService: StatsService) { }

  /**
   * Retrieve stats using stats-service
   */
  ngOnInit() {
    this.statsService.getStats()
      .then(stats => {
        if (stats) {
          this.stats = <Stats>stats;
        }
      })
      .catch(err => {
        console.error("Unable to retrieve stats.");
      });
  }

}
