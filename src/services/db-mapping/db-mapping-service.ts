import { Injectable } from "@angular/core";
import { Manifest } from "../../models/manifest";
import { Tickets } from "../../models/tickets";
import { ExecTimeService } from "../exec-time/exec-time-service";
import { SpinnerService } from "../utils/spinner-service";
import { DatabaseService } from "../database/database-service";
/**
 * Created by francesco on 05/12/2016.
 */

@Injectable()
export class DBMappingService {

  constructor(private execTimeService: ExecTimeService,
              private spinnerService: SpinnerService,
              private databaseService: DatabaseService) {}

  /**
   * Insert manifest and tickets data in the database
   * @param {Manifest} manifest - manifest data
   * @param {Tickets} tickets - tickets data
   * @returns {PromiseLike<any>} that resolves when all data has been inserted
   */
  mapApiData(manifest: Manifest, tickets: Tickets): Promise<any> {
    let startManifest: number,
      startTickets:  number = this.execTimeService.startCounting();

    this.spinnerService.setContent('Inserting orders...');

    return this.databaseService.chunkedBatchInsert(
      'orders',
      tickets.orders
    )
      .then(() => {
        this.execTimeService.setTime(
          'ticketsTime',
          this.execTimeService.endCounting(startTickets)
        );
        this.spinnerService.setContent('Inserting event...');
        return this.databaseService.insertInTable(
          'event',
          manifest.event );
      })
      .then(() => {
        this.spinnerService.setContent('Inserting credential types...');
        return this.databaseService.chunkedBatchInsert(
          'credentials_types',
          manifest.credentialTypes );
      })
      .then(() => {
        this.spinnerService.setContent('Inserting registrants...');
        return this.databaseService.chunkedBatchInsert(
          'registrants',
          manifest.registrants );
      })
      .then(() => {
        this.spinnerService.setContent('Inserting reports...');
        return this.databaseService.chunkedBatchInsert(
          'reports',
          manifest.getReports(manifest.reports) );
      })
      .then(() => {
        this.spinnerService.setContent('Inserting zones...');
        return this.databaseService.chunkedBatchInsert(
          'zones',
          manifest.zones );
      })
      .then(() => {
        this.spinnerService.setContent('Inserting schedules...');
        return this.databaseService.chunkedBatchInsert(
          'schedules',
          manifest.schedules );
      })
      .then(() => {
        this.spinnerService.setContent('Inserting manifest...');
        startManifest = this.execTimeService.startCounting();
        return this.databaseService.chunkedBatchInsert(
          'manifests',
          manifest.manifest );
      })
      .then(() => {
        this.execTimeService.setTime(
          'manifestTime',
          this.execTimeService.endCounting(startManifest)
        );
        this.spinnerService.setContent('Inserting zones acl...');
        return this.databaseService.chunkedBatchInsert(
          'zones_acl',
          manifest.zonesAcl );
      })
      .then(() => {
        this.spinnerService.setContent('Inserting zones acl passes...');
        return this.databaseService.chunkedBatchInsert(
          'zones_acl_passes',
          manifest.zonesAclPasses );
      })
      .then(() => {
        this.spinnerService.setContent('Inserting zones scanning points...');
        return this.databaseService.chunkedBatchInsert(
          'zones_scanning_points',
          manifest.zonesScanningPoints );
      })
      .then(() => {
        this.spinnerService.setContent('Inserting orders transactions...');
        startTickets = this.execTimeService.startCounting();
        return this.databaseService.chunkedBatchInsert(
          'orders_transactions',
          tickets.ordersTransactions );
      })
      .then(() => {
        this.execTimeService.setTime(
          'ticketsTime',
          this.execTimeService.getTime('ticketsTime') +
          this.execTimeService.endCounting(startTickets)
        );
        this.spinnerService.setContent('Inserting reports contents...');
        return this.databaseService.chunkedBatchInsert(
          'reports_contents',
          manifest.getReportsContents(manifest.reports) );
      })
      .then(() => {
        this.spinnerService.setContent('Inserting schedules segments...');
        return this.databaseService.chunkedBatchInsert(
          'schedules_segments',
          manifest.schedulesSegments );
      })
      .then(() => {
        this.spinnerService.setContent('Inserting scanning exceptions...');
        return this.databaseService.chunkedBatchInsert(
          'scanning_exceptions',
          manifest.scanningExceptions);
      })
      .then(() => {
        this.spinnerService.setContent('Inserting scanning exceptions zones acl...');
        return this.databaseService.chunkedBatchInsert(
          'scanning_exceptions_zones_acl',
          manifest.scanningExceptionsZonesAcl );
      });
  }

}
