import { async, TestBed } from "@angular/core/testing";
import { Platform } from "ionic-angular";
import { MockPlatform } from '../../mocks';
import { DatabaseService } from "./database-service";
import { MyDatabaseFactory } from "./database-factory/my-database-factory";
import { MockDatabaseFactory } from "./database-factory/mock-database-factory";
import { WindowRefService} from "../window-ref/window-ref-service";
import { Deserialize} from "cerialize";
import { Tickets } from "../../models/tickets";
import { ManifestEntity } from "../../models/manifest-entity";
import { OrderTransaction } from "../../models/order-transaction";
import { Manifest } from "../../models/manifest";
import { Registrant } from "../../models/registrant";
import { MOCK_MANIFEST, MOCK_TICKETS } from "../vfs-api/mock-data";
import { DecoratorSerDesService } from "../ser-des/decorator-ser-des-service";
/**
 * Created by francesco on 13/12/2016.
 */

describe('Services: Database-service', () => {
  let databaseService: DatabaseService;

  // Synchronous beforeEach
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DatabaseService,
        WindowRefService,
        DecoratorSerDesService,
        { provide: MyDatabaseFactory, useClass: MockDatabaseFactory },
        { provide: Platform,  useClass: MockPlatform }
      ]
    });

    databaseService = TestBed.get(DatabaseService);
  });

  // Asynchronous beforeEach
  beforeEach(async(() => {
    databaseService.openDatabase('test_db');
  }));

  it('should create tables', (done) => {
    databaseService.createTables()
      .then(res => {
        // 16 tables
        expect(res.length).toBe(16);
        done();
      });
  });

  it('should add the event object to the event table', done => {
    databaseService.insertInTable(
      'event',
      {
        dateEnd: 'date-end',
        dateStart: null,
        eventDescription: 'event-description',
        eventId: 'event-id',
        eventName: 'event-name',
        timezone: 'timezone'
      }
    )
      .then(() => {
        return databaseService.query('SELECT * FROM event');
      })
      .then(result => {
        let event = result.res.rows.item(0);

        expect(event.date_end).toBe('date-end');
        expect(event.date_start).toBeNull();
        expect(event.event_description).toBe('event-description');
        expect(event.event_id).toBe('event-id');
        expect(event.event_name).toBe('event-name');
        expect(event.timezone).toBe('timezone');
        done();
      });
  });

  it('should perform a batch query', done => {
    let ordersTransactions: OrderTransaction[] = Deserialize(MOCK_TICKETS, Tickets).ordersTransactions;

    databaseService.batchQuery('orders_transactions', ordersTransactions)
      .then(() => {
        return databaseService.query('SELECT * FROM orders_transactions');
      })
      .then(result => {
        expect(result.res.rows.length).toBe(2);
        expect(result.res.rows.item(0).order_id).toBe('order-8967');
        expect(result.res.rows.item(1).identifier).toBe('AB567kl');
        done();
      });
  });

  it('should perform a chunked batch query', done => {
    spyOn(databaseService, 'batchQuery').and.callThrough();


    let manifests: ManifestEntity[] = Deserialize(MOCK_MANIFEST, Manifest).manifest;
    databaseService.setBatchSize(2);

    databaseService.chunkedBatchInsert('manifests', manifests)
      .then(() => {
        expect(databaseService.batchQuery).toHaveBeenCalledTimes(4);
        done();
      });
  });

  it('should retrieve the searched ticket', done => {
    databaseService.searchForTicket('transaction-8967')
      .then((result: OrderTransaction) => {
        expect(result.orderId).toBe('order-8967');
        expect(result.transactionId).toBe('transaction-8967');
        expect(result.barcodeId).toBe('%STGRP5GKZS');
        expect(result.modified).toBe('2015-03-20 22:42:30');
        expect(result.deleted).toBeNull();
        expect(result.transactionType).toBe('TICKET');
        expect(result.identifier).toBe('AB567kl');
        expect(result.credentialTypeId).toBe('credential-type-5689');
        expect(result.voided).toBeNull();
        expect(result.activated).toBe('2015-03-30 00:54:43');
        expect(result.deactivated).toBeNull();
        expect(result.deactivationReason).toBeNull();
        expect(result.scanStatus).toBe(0);
        expect(result.oneDay).toBeNull();
        expect(result.registrantId).toBeNull();
        expect(result.manifestId).toBe('manifest-5679');
        expect(result.lastScanMode).toBeNull();
        expect(result.tokensGranted).toBe(-1);
        expect(result.tokensUsed).toBe(0);

        done();
      });
  });

  it('should retrieve the searched credential', done => {
    databaseService.searchForCredential('manifest-5')
      .then((result: ManifestEntity) => {
      expect(result.manifestId).toBe('manifest-5');
      expect(result.modified).toBe('2015-04-18 09:04:14');
      expect(result.isDeleted).toBe(0);
      expect(result.scanCode).toBe('04FFB932A04080');
      expect(result.activated).toBe('2015-03-30 00:57:47');
      expect(result.deactivated).toBeNull();
      expect(result.deactivationReason).toBeNull();
      expect(result.credentialTypeId).toBe('frbf-ceioceow-33nj-434ijin3m');
      expect(result.scanStatus).toBe(0);
      expect(result.validationType).toBe('RFID');

      done();
      });
  });

  it('should retrieve the inserted registrant through related searching method', done => {
    databaseService.insertInTable(
      'registrants',
      {
        nameFirst: 'Paolo',
        nameLast: 'Cerberi',
        registrantId: 'registrant-id-1'
      }
    )
      .then(() => {
        return databaseService.searchForRegistrant('registrant-id-1');
      })
      .then((result: Registrant) => {
        expect(result.nameFirst).toBe('Paolo');
        expect(result.nameLast).toBe('Cerberi');
        expect(result.registrantId).toBe('registrant-id-1');
        done();
      });
  });

  it('should retrieve the ticket searching it by manifest id', done => {
    databaseService.searchForTicketByManifestId('manifest-5679')
      .then((result: OrderTransaction) => {
        expect(result.orderId).toBe('order-8967');
        expect(result.transactionId).toBe('transaction-8967');
        expect(result.barcodeId).toBe('%STGRP5GKZS');
        expect(result.modified).toBe('2015-03-20 22:42:30');
        expect(result.deleted).toBeNull();
        expect(result.transactionType).toBe('TICKET');
        expect(result.identifier).toBe('AB567kl');
        expect(result.credentialTypeId).toBe('credential-type-5689');
        expect(result.voided).toBeNull();
        expect(result.activated).toBe('2015-03-30 00:54:43');
        expect(result.deactivated).toBeNull();
        expect(result.deactivationReason).toBeNull();
        expect(result.scanStatus).toBe(0);
        expect(result.oneDay).toBeNull();
        expect(result.registrantId).toBeNull();
        expect(result.manifestId).toBe('manifest-5679');
        expect(result.lastScanMode).toBeNull();
        expect(result.tokensGranted).toBe(-1);
        expect(result.tokensUsed).toBe(0);

        done();
      });
  });

  it('should retrieve random credentials', done => {
    databaseService.selectRandomCredentials()
      .then(result => {
        expect(result.length).toBe(2);
        expect(result[0]).toBe('manifest-1');
        expect(result[1]).toBe('manifest-2');
        done();
      });
  });

  it('should retrieve random tickets', done => {
    databaseService.selectRandomTickets()
      .then(result => {
        expect(result.length).toBe(2);
        expect(result[0]).toBe('transaction-8967');
        expect(result[1]).toBe('transaction-9967');
        done();
      });
  });

  it('should give back current stats', done => {
    databaseService.calculateStats()
      .then(results => {
        expect(results[0]).toBe(7);
        expect(results[1]).toBe(0);
        expect(results[2]).toBe(2);
        done();
      })
  });

  it('should clear the database', done => {
    databaseService.clear().then(res => {
      expect(res).toBeUndefined();
      done();
    });
  });

});

