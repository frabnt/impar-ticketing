import { DBMappingService } from "./db-mapping-service";
import { TestBed } from "@angular/core/testing";
import { SpinnerService } from "../utils/spinner-service";
import { MockSpinnerService } from "../utils/mock-spinner-service";
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
        { provide: DatabaseService, useClass: MockDatabaseService },
        { provide: SpinnerService, useClass: MockSpinnerService },
      ]
    });

    dbMappingService = TestBed.get(DBMappingService);
  });

  it('should map API data', done => {
    spyOn(MockSpinnerService.prototype, 'setContent').and.callThrough();
    spyOn(MockExecTimeService.prototype, 'startCounting').and.callThrough();
    spyOn(MockExecTimeService.prototype, 'endCounting').and.callThrough();
    spyOn(MockExecTimeService.prototype, 'setTime').and.callThrough();
    spyOn(MockDatabaseService.prototype, 'insertInTable').and.callThrough();
    spyOn(MockDatabaseService.prototype, 'chunkedBatchInsert').and.callThrough();

    let manifest: Manifest = Deserialize(MOCK_MANIFEST, Manifest);
    let tickets: Tickets = Deserialize(MOCK_TICKETS, Tickets);

    dbMappingService.mapApiData(manifest, tickets)
      .then(() => {
        expect(MockSpinnerService.prototype.setContent).toHaveBeenCalledTimes(16);
        expect(MockExecTimeService.prototype.startCounting).toHaveBeenCalledTimes(3);
        expect(MockExecTimeService.prototype.endCounting).toHaveBeenCalledTimes(3);
        expect(MockExecTimeService.prototype.setTime).toHaveBeenCalledTimes(3);
        expect(MockDatabaseService.prototype.insertInTable).toHaveBeenCalledTimes(1);
        expect(MockDatabaseService.prototype.chunkedBatchInsert).toHaveBeenCalledTimes(15);

        expect(MockDatabaseService.prototype.insertInTable).toHaveBeenCalledWith(
          'event',
          manifest.event
        );
        expect(MockDatabaseService.prototype.chunkedBatchInsert).toHaveBeenCalledWith(
          'credentials_types',
          manifest.credentialTypes
        );
        expect(MockDatabaseService.prototype.chunkedBatchInsert).toHaveBeenCalledWith(
          'schedules',
          manifest.schedules
        );
        expect(MockExecTimeService.prototype.endCounting).toHaveBeenCalledWith(
          1000
        );
        expect(MockExecTimeService.prototype.setTime).toHaveBeenCalledWith(
          'ticketsTime',
          2000
        );
        expect(MockExecTimeService.prototype.setTime).toHaveBeenCalledWith(
          'manifestTime',
          2000
        );

        done();
      });
  });
});
