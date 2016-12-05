import { AbstractSqlStorage } from "./abstract-sql-storage";
import { MyDatabaseFactory } from "./my-database-factory";
import { Injectable } from "@angular/core";
import { Deserialize } from "cerialize";
import { OrderTransaction } from "../../models/order-transaction";
import { ManifestEntity } from "../../models/manifest-entity";
import { Registrant } from "../../models/registrant";
import { Platform } from "ionic-angular";
import { Manifest } from "../../models/manifest";
import { Tickets } from "../../models/tickets";
import { SpinnerService } from "../utils/spinner-service";
import { ExecTimeService } from "../exec-time/exec-time-service";
/**
 * Created by francesco on 04/11/2016.
 */

const DB_NAME: string = 'impar_storage';

@Injectable()
export class DatabaseService {
  private storage: AbstractSqlStorage;
  // Max number of multiple insert
  private static MAX_BATCH_SIZE: number = 40000;

  /**
   * @constructor
   */
  constructor(private databaseFactory: MyDatabaseFactory,
              private spinnerService: SpinnerService,
              private execTimeService: ExecTimeService,
              private platform: Platform) { }

  /**
   * Open the database
   */
  openDatabase(): Promise<any> {
    return this.platform.ready()
      .then(() => {
        if(!this.storage) {
          this.storage = this.databaseFactory
            .getDatabaseInstance({ name: DB_NAME });
        }
        return;
      })
      .catch(err => {
        return this.handleError({ err: err });
      });
  }

  /**
   * Enable foreign key support
   * @returns {Promise<any>} that resolves once the foreign key support has been enabled
   */
  enableForeignKey(): Promise<any> {
    return this.query('PRAGMA foreign_keys = ON');
  }

  /**
   * Create all DB tables
   * @returns {Promise<any>} that resolves when all db tables have been created
   */
  createTables(): Promise<any> {
    let creationTablePrx: string = 'CREATE TABLE IF NOT EXISTS ';

    return Promise.all([
      this.query( creationTablePrx + `orders (
                          barcode_id TEXT,
                          deleted TEXT,
                          modified TEXT,
                          order_id TEXT PRIMARY KEY
                        )` ),
      this.query( creationTablePrx + `event (
                          date_end TEXT,
                          date_start TEXT,
                          event_description TEXT,
                          event_id TEXT PRIMARY KEY,
                          event_name TEXT,
                          timezone TEXT
                        )` ),
      this.query( creationTablePrx + `credentials_types (
                          credential_desc TEXT,
                          credential_name TEXT,
                          credential_type TEXT,
                          credential_type_id TEXT PRIMARY KEY,
                          deleted TEXT,
                          is_active INTEGER,
                          is_any_uid INTEGER,
                          is_one_day INTEGER,
                          modified TEXT,
                          tokens_granted INTEGER,
                          validation_type TEXT
                        )` ),
      this.query( creationTablePrx + `registrants (
                          name_first TEXT,
                          name_last TEXT,
                          registrant_id TEXT PRIMARY KEY
                        )` ),
      this.query( creationTablePrx + `reports (
                          report_id TEXT PRIMARY KEY,
                          type TEXT
                        )` ),
      this.query( creationTablePrx + `zones (
                          is_active INTEGER,
                          is_deleted INTEGER,
                          is_multipeer INTEGER,
                          modified TEXT,
                          zone_id TEXT PRIMARY KEY,
                          zone_name TEXT
                        )` ),
      this.query( creationTablePrx + `schedules (
                          is_active INTEGER,
                          is_deleted INTEGER,
                          modified TEXT,
                          scanning_schedule_id TEXT PRIMARY KEY,
                          schedule_name TEXT
                        )` ),
      this.query( creationTablePrx + `manifests (
                          activated TEXT,
                          credential_type_id TEXT,
                          deactivated TEXT,
                          deactivation_reason TEXT,
                          is_deleted INTEGER,
                          manifest_id TEXT PRIMARY KEY,
                          modified TEXT,
                          scan_code TEXT,
                          scan_status INTEGER,
                          validation_type TEXT,
                          FOREIGN KEY(credential_type_id) REFERENCES credential_types(credential_type_id)
                        )` ),
      this.query( creationTablePrx + `zones_acl (
                          is_deleted INTEGER,
                          is_tokens_acl INTEGER,
                          modified TEXT,
                          zone_acl_id TEXT PRIMARY KEY,
                          zone_id TEXT,
                          FOREIGN KEY(zone_id) REFERENCES zones(zone_id)
                        )` ),
      this.query( creationTablePrx + `zones_acl_passes (
                          credential_type_id TEXT,
                          is_active INTEGER,
                          is_deleted INTEGER,
                          is_scheduled INTEGER,
                          modified TEXT,
                          scan_type TEXT,
                          scanning_schedule_id TEXT,
                          zone_acl_id TEXT,
                          zone_acl_pass_id TEXT PRIMARY KEY,
                          FOREIGN KEY(credential_type_id) REFERENCES credentials_types(credential_type_id),
                          FOREIGN KEY(zone_acl_id) REFERENCES zones_acl(zone_acl_id),
                          FOREIGN KEY(scanning_schedule_id) REFERENCES schedules(scanning_schedule_id)
                        )` ),
      this.query( creationTablePrx + `zones_scanning_points (
                          is_active INTEGER,
                          is_deleted INTEGER,
                          modified TEXT,
                          scan_direction TEXT,
                          scanning_point_id TEXT PRIMARY KEY,
                          scanpoint_name TEXT,
                          zone_acl_id TEXT,
                          zone_id TEXT,
                          FOREIGN KEY(zone_acl_id) REFERENCES zones_acl(zone_acl_id),
                          FOREIGN KEY(zone_id) REFERENCES zones(zone_id)
                        )` ),
      this.query( creationTablePrx + `orders_transactions (
                          activated TEXT,
                          barcode_id TEXT,
                          credential_type_id TEXT,
                          deactivated TEXT,
                          deactivation_reason TEXT,
                          deleted TEXT,
                          identifier TEXT,
                          last_scan_mode TEXT,
                          manifest_id TEXT,
                          modified TEXT,
                          one_day TEXT,
                          order_id TEXT,
                          registrant_id TEXT,
                          scan_status INTEGER,
                          tokens_granted INTEGER,
                          tokens_used INTEGER,
                          transaction_id TEXT PRIMARY KEY,
                          transaction_type TEXT,
                          voided TEXT,
                          FOREIGN KEY(credential_type_id) REFERENCES credentials_types(credential_type_id),
                          FOREIGN KEY(manifest_id) REFERENCES manifests(manifest_id),
                          FOREIGN KEY(order_id) REFERENCES orders(order_id),
                          FOREIGN KEY(registrant_id) REFERENCES registrants(registrant_id)
                        )` ),
      this.query( creationTablePrx + `reports_contents (
                          entry_id TEXT,
                          value TEXT,
                          report_id TEXT,
                          credential_type_id TEXT,
                          zone_id TEXT,
                          PRIMARY KEY (
                                  report_id,
                                  credential_type_id,
                                  zone_id )
                        )` ),
      this.query( creationTablePrx + `schedules_segments (
                          is_active INTEGER,
                          is_deleted INTEGER,
                          modified TEXT,
                          scanning_schedule_id TEXT,
                          scanning_schedule_segment_id TEXT PRIMARY KEY,
                          segment_start TEXT,
                          segment_end TEXT,
                          FOREIGN KEY(scanning_schedule_id) REFERENCES schedules(scanning_schedule_id)
                        )` ),
      this.query( creationTablePrx + `scanning_exceptions (
                          exception_id TEXT PRIMARY KEY,
                          exception_name TEXT,
                          exception_desc TEXT,
                          modified TEXT,
                          is_deleted INTEGER,
                          is_active INTEGER
                        )` ),
      this.query( creationTablePrx + `scanning_exceptions_zones_acl(
                          exception_zone_id TEXT PRIMARY KEY,
                          exception_id TEXT,
                          zone_acl_id TEXT,
                          modified TEXT,
                          is_deleted INTEGER,
                          is_active INTEGER,
                          FOREIGN KEY(exception_id) REFERENCES scanning_exceptions(exception_id),
                          FOREIGN KEY(zone_acl_id) REFERENCES zones_acl(zone_acl_id)
                        )`)
    ]);
  }

  /**
   * Insert an object into a table
   * @param {string} tableName - name of the table
   * @param {Object} obj - object to insert
   * @returns {Promise<any>} that resolves when the object has been inserted
   */
  insertInTable(tableName: string, obj: {}): Promise<any> {
    if(!obj)
      return;
    let values = this.objToValuesArray(obj);
    return this.query(
      `INSERT INTO ${tableName} VALUES (${Array(values.length+1).join('?,').slice(0,-1)})`,
      values
    );
  }

  /**
   * Convert an object into an array of values
   * @param {Object} obj - object to convert
   * @returns {any[]}
   */
  private objToValuesArray(obj): any[] {
    return Object.keys(obj).map(key => obj[key]);
  }

  /**
   * Insert manifest and tickets data in the database
   * @param {Manifest} manifest - manifest data
   * @param {Tickets} tickets - tickets data
   * @returns {PromiseLike<any>} that resolves when all data has been inserted
   */
  insertAllData(manifest: Manifest, tickets: Tickets): Promise<any> {
    let startManifest: number,
        startTickets:  number = this.execTimeService.startCounting();

    this.spinnerService.setContent('Inserting orders...');

    return this.batchInsertInTable(
      'orders',
      tickets.orders
    )
      .then(() => {
        this.execTimeService.setTime(
          'ticketsTime',
          this.execTimeService.endCounting(startTickets)
        );
        this.spinnerService.setContent('Inserting event...');
        return this.insertInTable(
          'event',
          manifest.event );
      })
      .then(() => {
        this.spinnerService.setContent('Inserting credential types...');
        return this.batchInsertInTable(
          'credentials_types',
          manifest.credentialTypes );
      })
      .then(() => {
        this.spinnerService.setContent('Inserting registrants...');
        return this.batchInsertInTable(
          'registrants',
          manifest.registrants );
      })
      .then(() => {
        this.spinnerService.setContent('Inserting reports...');
        return this.batchInsertInTable(
          'reports',
          manifest.getReports(manifest.reports) );
      })
      .then(() => {
        this.spinnerService.setContent('Inserting zones...');
        return this.batchInsertInTable(
          'zones',
          manifest.zones );
      })
      .then(() => {
        this.spinnerService.setContent('Inserting schedules...');
        return this.batchInsertInTable(
          'schedules',
          manifest.schedules );
      })
      .then(() => {
        this.spinnerService.setContent('Inserting manifest...');
        startManifest = this.execTimeService.startCounting();
        return this.batchInsertInTable(
          'manifests',
          manifest.manifest );
      })
      .then(() => {
        this.execTimeService.setTime(
          'manifestTime',
          this.execTimeService.endCounting(startManifest)
        );
        this.spinnerService.setContent('Inserting zones acl...');
        return this.batchInsertInTable(
          'zones_acl',
          manifest.zonesAcl );
      })
      .then(() => {
        this.spinnerService.setContent('Inserting zones acl passes...');
        return this.batchInsertInTable(
          'zones_acl_passes',
          manifest.zonesAclPasses );
      })
      .then(() => {
        this.spinnerService.setContent('Inserting zones scanning points...');
        return this.batchInsertInTable(
          'zones_scanning_points',
          manifest.zonesScanningPoints );
      })
      .then(() => {
        this.spinnerService.setContent('Inserting orders transactions...');
        startTickets = this.execTimeService.startCounting();
        return this.batchInsertInTable(
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
        return this.batchInsertInTable(
          'reports_contents',
          manifest.getReportsContents(manifest.reports) );
      })
      .then(() => {
        this.spinnerService.setContent('Inserting schedules segments...');
        return this.batchInsertInTable(
          'schedules_segments',
          manifest.schedulesSegments );
      })
      .then(() => {
        this.spinnerService.setContent('Inserting scanning exceptions...');
        return this.batchInsertInTable(
          'scanning_exceptions',
          manifest.scanningExceptions);
      })
      .then(() => {
        this.spinnerService.setContent('Inserting scanning exceptions zones acl...');
        return this.batchInsertInTable(
          'scanning_exceptions_zones_acl',
          manifest.scanningExceptionsZonesAcl );
      });
  }

  /**
   * Insert multiple objects (of the same type) into a table through
   * batch queries. The number of batch queries depends on the array size
   * and is defined by the configured value of MAX_BATCH_SIZE property
   * @param {string} tableName - name of the table
   * @param {Object} arrObjs - objects array
   * @returns {Promise<any>} that resolves when all batch queries have been performed
   */
  batchInsertInTable(tableName: string, arrObjs: any[]): Promise<any> {
    // Split the array into smaller chunks
    let chunks = this.chunksArray(arrObjs, DatabaseService.MAX_BATCH_SIZE),
      result = Promise.resolve(); // To start the chain

    // building the promises chain
    chunks.map(chunk => {
      result = result.then(() => {
        return this.batchQuery(tableName, chunk);
      });
    });

    return result;
  }

  /**
   * Split an array into smaller chunks
   * @param arr - the array to split
   * @param size - the size of the chunk
   * @returns {Array} - the array of chunks
   */
  private chunksArray(arr: any[], size: number): any[] {
    let result = [];
    while(arr.length > 0) {
      result.push(arr.splice(0, size));
    }
    return result;
  }

  /**
   * Insert multiple objects (of the same type) into a table
   * @param {string} tableName - name of the table
   * @param {Object} arrObjs - objects array
   * @returns {Promise<any>} that resolves once the batch query has been performed
   */
  batchQuery(tableName: string, arrObjs: any[]): Promise<any> {
    if(!arrObjs.length)
      return;

    let values = this.objsToValuesArray(arrObjs);
    return this.storage.batch(
      `INSERT INTO ${tableName} VALUES (${Array(values[0].length + 1).join('?,').slice(0, -1)})`,
      values
    )
      .catch(this.handleError);
  }

  /**
   * Convert an objects array into a values 2D-array
   * @param {Array} arrObjs - objects array to convert
   * @returns {any[][]}
   */
  private objsToValuesArray(arrObjs: any[]): any[] {
    return arrObjs.map(obj => this.objToValuesArray(obj));
  }

  /**
   * Search for a ticket in the database
   * @param {string} ticketId - the ticket to search
   * @returns {Promise<OrderTransaction>} that resolves with the ticket object
   */
  searchForTicket(ticketId: string): Promise<OrderTransaction> {
    return this.query(
      'SELECT * FROM orders_transactions WHERE transaction_id = ? LIMIT 1',
      [ticketId]
    )
      .then(result => {
        if(!result.res.rows.length)
          return;
        //deserializing query result
        return Deserialize(
          result.res.rows.item(0),
          OrderTransaction
        );
      });
  }

  /**
   * Search for a ticket by manifest id
   * @param {string} manifestId - the manifest to search in tickets table
   * @returns {Promise<OrderTransaction>} that resolves with the ticket object
   */
  searchForTicketByManifestId(manifestId: string): Promise<OrderTransaction> {
    return this.query(
      'SELECT * FROM orders_transactions WHERE manifest_id = ? LIMIT 1',
      [manifestId]
    )
      .then(result => {
        if(!result.res.rows.length)
          return;
        return Deserialize(
          result.res.rows.item(0),
          OrderTransaction
        );
      });
  }

  /**
   * Search for a credential in the database
   * @param {string} credentialId - the credential to search
   * @returns {Promise<ManifestEntity>} that resolves with the credential object
   */
  searchForCredential(credentialId: string): Promise<ManifestEntity> {
    return this.query(
      'SELECT * FROM manifests WHERE manifest_id = ? LIMIT 1',
      [credentialId]
    )
      .then(result => {
        if(!result.res.rows.length)
          return;
        return Deserialize(
          result.res.rows.item(0),
          ManifestEntity
        );
      });
  }

  /**
   * Search for a registrant in the database
   * @param {string} registrantId - the registrant to search
   * @returns {Promise<Registrant>} that resolves with the registrant object
   */
  searchForRegistrant(registrantId: string): Promise<Registrant> {
    return this.query(
      'SELECT * FROM registrants WHERE registrant_id = ? LIMIT 1',
      [registrantId]
    )
      .then(result => {
        if(!result.res.rows.length)
          return;
        return Deserialize(
          result.res.rows.item(0),
          Registrant
        );
      });
  }

  /**
   * Select two random credentials from the database
   * @returns {Promise<string[]>} that resolves with the string array
   *                              containing manifest_id values
   */
  selectRandomCredentials(): Promise<string[]> {
    return this.query(
      'SELECT manifest_id FROM manifests ORDER BY manifest_id LIMIT 2'
    )
      .then(result => {
        let rows = result.res.rows;
        return [
          rows.item(0).manifest_id,
          rows.item(1).manifest_id
        ];
      });
  }

  /**
   * Select two random tickets from the database
   * @return {Promise<string[]>} that resolves with the string array
   *                             containing transaction_id values
   */
  selectRandomTickets(): Promise<string[]> {
    return this.query(
      'SELECT transaction_id FROM orders_transactions ORDER BY transaction_id LIMIT 2'
    )
      .then(result => {
        let rows = result.res.rows;
        return [
          rows.item(0).transaction_id,
          rows.item(1).transaction_id
        ];
      });
  }

  /**
   * Calculate total number of manifest and tickets
   * @returns {Promise<number[]>} that resolves with the number of manifest,
   *                              orders and orders transactions respectively
   */
  calculateStats(): Promise<number[]> {
    return Promise.all([
      this.query('SELECT COUNT(*) as count FROM manifests')
        .then(result => { return result.res.rows.item(0).count }),
      this.query('SELECT COUNT(*) as count FROM orders')
        .then(result => { return result.res.rows.item(0).count }),
      this.query('SELECT COUNT(*) as count FROM orders_transactions')
        .then(result => { return result.res.rows.item(0).count })
    ]);
  }

  /**
   * Clear the database
   * @returns {Promise<any>} that resolves once the database has been cleared
   */
  clear(): Promise<any> {
    return this.storage.clear()
      .then(() => {
        // Resetting storage after deleting the database
        this.storage = undefined;
        return;
      })
      .catch(this.handleError);
  }

  /**
   * Perform an arbitrary SQL operation on the database
   *
   * @param {string} query - the query to run
   * @param {array} params - the additional params to use for query placeholders
   * @return {Promise<any>} that resolves or rejects with an object of the form
   *                        { tx: Transaction, res: Result (or err)}
   */
  private query(query: string, params = []): Promise<any> {
    return this.storage.query(query, params)
      .catch(this.handleError);
  }

  /**
   * Arrange the error message to return
   * @param {any} error
   * @returns {Promise<string>} that resolves with a string embedding the error msg
   */
  private handleError(error: any) {
    return Promise.reject(
      error.err.message ?
        error.err.message :
        'Database error'
    );
  }

}
