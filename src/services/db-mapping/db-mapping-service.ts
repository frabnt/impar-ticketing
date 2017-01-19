import { Injectable } from "@angular/core";
import { Manifest } from "../../models/manifest";
import { Tickets } from "../../models/tickets";
import { ExecTimeService } from "../exec-time/exec-time-service";
import { DatabaseService } from "../database/database-service";
/**
 * Created by francesco on 05/12/2016.
 */

@Injectable()
export class DBMappingService {

  constructor(private execTimeService: ExecTimeService,
              private databaseService: DatabaseService) {}

  /**
   * Map manifest data in the database
   * @param manifest - the data need to be inserted
   * @returns {Promise<TResult>} that resolves when all manifest data has been inserted
   */
  mapManifestData(manifest: Manifest): Promise<any> {
    let startManifest = this.execTimeService.startCounting();

    return this.databaseService.insertInTable(
      'event',
      manifest.event
    )
      .then(() => {
        return this.databaseService.chunkedBatchInsert(
          'credentials_types',
          manifest.credentialTypes );
      })
      .then(() => {
        return this.databaseService.chunkedBatchInsert(
          'registrants',
          manifest.registrants );
      })
      .then(() => {
        return this.databaseService.chunkedBatchInsert(
          'reports',
          manifest.getReports(manifest.reports) );
      })
      .then(() => {
        return this.databaseService.chunkedBatchInsert(
          'zones',
          manifest.zones );
      })
      .then(() => {
        return this.databaseService.chunkedBatchInsert(
          'schedules',
          manifest.schedules );
      })
      .then(() => {
        return this.databaseService.chunkedBatchInsert(
          'manifests',
          manifest.manifest );
      })
      .then(() => {
        return this.databaseService.chunkedBatchInsert(
          'zones_acl',
          manifest.zonesAcl );
      })
      .then(() => {
        return this.databaseService.chunkedBatchInsert(
          'zones_acl_passes',
          manifest.zonesAclPasses );
      })
      .then(() => {
        return this.databaseService.chunkedBatchInsert(
          'zones_scanning_points',
          manifest.zonesScanningPoints );
      })
      .then(() => {
        return this.databaseService.chunkedBatchInsert(
          'reports_contents',
          manifest.getReportsContents(manifest.reports) );
      })
      .then(() => {
        return this.databaseService.chunkedBatchInsert(
          'schedules_segments',
          manifest.schedulesSegments );
      })
      .then(() => {
        return this.databaseService.chunkedBatchInsert(
          'scanning_exceptions',
          manifest.scanningExceptions);
      })
      .then(() => {
        return this.databaseService.chunkedBatchInsert(
          'scanning_exceptions_zones_acl',
          manifest.scanningExceptionsZonesAcl );
      })
      .then(() => {
        this.execTimeService.setTime(
          'manifestTime',
          this.execTimeService.endCounting(startManifest)
        );
        return;
      });

  }

  /**
   * Map tickets data in the database
   * @param manifest - the data need to be inserted
   * @returns {Promise<TResult>} that resolves when all tickets data has been inserted
   */
  mapTicketsData(tickets: Tickets): Promise<any> {
    let startTickets = this.execTimeService.startCounting();

    return this.databaseService.chunkedBatchInsert(
      'orders',
      tickets.orders
    )
      .then(() => {
        return this.databaseService.chunkedBatchInsert(
          'orders_transactions',
          tickets.ordersTransactions );
      })
      .then(() => {
        this.execTimeService.addTime(
          'ticketsTime',
          this.execTimeService.endCounting(startTickets)
        );
        return;
      });
  }

}
