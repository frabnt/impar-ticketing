import { DBMappingService } from "./db-mapping-service";
import { TestBed } from "@angular/core/testing";
import { MockExecTimeService } from "../exec-time/mock-exec-time-service";
import { ExecTimeService } from '../exec-time/exec-time-service';
import { MockDatabaseService } from "../database/mock-database-service";
import { DatabaseService } from '../database/database-service';
import { Manifest } from "../../models/manifest";
import { Tickets } from "../../models/tickets";
import { Deserialize } from "cerialize";
import { MOCK_MANIFEST, MOCK_TICKETS } from "../vfs-api/mock-data";
/**
 * Created by francesco on 13/12/2016.
 */

describe('Services: DB-mapping-service', () => {

  let dbMappingService: DBMappingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DBMappingService,
        { provide: ExecTimeService,  useClass: MockExecTimeService },
        { provide: DatabaseService, useClass: MockDatabaseService }
      ]
    });

    dbMappingService = TestBed.get(DBMappingService);
  });

  describe('should map manifest data', () => {
    let manifest: Manifest = Deserialize(MOCK_MANIFEST, Manifest);

    beforeEach(() => {
      spyOn(MockExecTimeService.prototype, 'startCounting').and.callThrough();
      spyOn(MockExecTimeService.prototype, 'endCounting').and.callThrough();
      spyOn(MockExecTimeService.prototype, 'setTime').and.callThrough();

      spyOn(MockDatabaseService.prototype, 'insertInTable').and.callThrough();
      spyOn(MockDatabaseService.prototype, 'chunkedBatchInsert').and.callThrough();
    });

    beforeEach(done => {
      dbMappingService.mapManifestData(manifest)
        .then(() => {
          done();
        });
    });

    it('should calculate the time to perform manifest mapping', () => {
      expect(MockExecTimeService.prototype.startCounting).toHaveBeenCalledTimes(1);
      expect(MockExecTimeService.prototype.endCounting).toHaveBeenCalledTimes(1);
      expect(MockExecTimeService.prototype.setTime).toHaveBeenCalledTimes(1);

      expect(MockExecTimeService.prototype.endCounting).toHaveBeenCalledWith(
        1000
      );
      expect(MockExecTimeService.prototype.setTime).toHaveBeenCalledWith(
        'manifestTime',
        2000
      );
    });

    it('should map the event through a simple insert', () => {
      expect(MockDatabaseService.prototype.insertInTable).toHaveBeenCalledTimes(1);
      expect(MockDatabaseService.prototype.insertInTable).toHaveBeenCalledWith(
        'event',
        manifest.event
      );
    });

    it('should map all other manifest data through multiple batch insert', () => {
      expect(MockDatabaseService.prototype.chunkedBatchInsert).toHaveBeenCalledTimes(13);

      expect(MockDatabaseService.prototype.chunkedBatchInsert).toHaveBeenCalledWith(
        'credentials_types',
        manifest.credentialTypes
      );
      expect(MockDatabaseService.prototype.chunkedBatchInsert).toHaveBeenCalledWith(
        'schedules',
        manifest.schedules
      );
      // and so on...
    });

  });

  describe('should map tickets data', () => {
    let tickets: Tickets = Deserialize(MOCK_TICKETS, Tickets);

    beforeEach(() => {
      spyOn(MockExecTimeService.prototype, 'startCounting').and.callThrough();
      spyOn(MockExecTimeService.prototype, 'endCounting').and.callThrough();
      spyOn(MockExecTimeService.prototype, 'addTime').and.callThrough();

      spyOn(MockDatabaseService.prototype, 'chunkedBatchInsert').and.callThrough();
    });

    beforeEach(done => {
      dbMappingService.mapTicketsData(tickets)
        .then(() => {
          done();
        });
    });

    it('should calculate the time to perform tickets mapping', () => {
      expect(MockExecTimeService.prototype.startCounting).toHaveBeenCalledTimes(1);
      expect(MockExecTimeService.prototype.endCounting).toHaveBeenCalledTimes(1);
      expect(MockExecTimeService.prototype.addTime).toHaveBeenCalledTimes(1);

      expect(MockExecTimeService.prototype.endCounting).toHaveBeenCalledWith(
        1000
      );
      expect(MockExecTimeService.prototype.addTime).toHaveBeenCalledWith(
        'ticketsTime',
        2000
      );
    });

    it('should map tickets data through multiple batch insert', () => {
      expect(MockDatabaseService.prototype.chunkedBatchInsert).toHaveBeenCalledTimes(2);

      expect(MockDatabaseService.prototype.chunkedBatchInsert).toHaveBeenCalledWith(
        'orders',
        tickets.orders
      );
      expect(MockDatabaseService.prototype.chunkedBatchInsert).toHaveBeenCalledWith(
        'orders_transactions',
        tickets.ordersTransactions
      );
    });

  });

});
