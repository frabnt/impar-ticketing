import { AbstractSqlStorage } from "./abstract-sql-storage";
import { MyDatabaseFactory } from "./my-database-factory";
import { Injectable } from "@angular/core";
import { Deserialize } from "cerialize";
import { OrderTransaction } from "../../models/order-transaction";
import { ManifestEntity } from "../../models/manifest-entity";
import { Registrant } from "../../models/registrant";


/**
 * Created by francesco on 04/11/2016.
 */

const DB_NAME: string = 'impar_storage';

@Injectable()
export class DatabaseService {
  private storage: AbstractSqlStorage;
  private databaseFactory: MyDatabaseFactory;

  /**
   * @constructor
   */
  constructor() {
    this.databaseFactory = new MyDatabaseFactory();
  }

  /**
   * Open the database
   */
  openDatabase() {
    this.storage = this.databaseFactory
      .getDatabaseInstance({ name: DB_NAME });
  }

  /**
   * Enable foreign key support
   * @returns {Promise<any>}
   */
  enableForeignKey(): Promise<any> {
    return this.storage.query('PRAGMA foreign_keys = ON');
  }

  /**
   * Create all DB tables
   * @returns {Promise<any>}
   */
  createTables(): Promise<any> {
    let createTablePrx: string = 'CREATE TABLE IF NOT EXISTS ';

    return Promise.all([
      this.storage.query(createTablePrx + `orders (
                          barcode_id TEXT,
                          deleted TEXT,
                          modified TEXT,
                          order_id TEXT PRIMARY KEY
                        )`),
      this.storage.query(createTablePrx + `event (
                          date_end TEXT,
                          date_start TEXT,
                          event_description TEXT,
                          event_id TEXT PRIMARY KEY,
                          event_name TEXT,
                          timezone TEXT
                        )`),
      this.storage.query( createTablePrx + `credentials_types (
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
      this.storage.query( createTablePrx + `registrants (
                          name_first TEXT,
                          name_last TEXT,
                          registrant_id TEXT PRIMARY KEY
                        )` ),
      this.storage.query( createTablePrx + `reports (
                          report_id TEXT PRIMARY KEY,
                          type TEXT
                        )` ),
      this.storage.query( createTablePrx + `zones (
                          is_active INTEGER,
                          is_deleted INTEGER,
                          is_multipeer INTEGER,
                          modified TEXT,
                          zone_id TEXT PRIMARY KEY,
                          zone_name TEXT
                        )` ),
      this.storage.query( createTablePrx + `schedules (
                          is_active INTEGER,
                          is_deleted INTEGER,
                          modified TEXT,
                          scanning_schedule_id TEXT PRIMARY KEY,
                          schedule_name TEXT
                        )` ),
      this.storage.query( createTablePrx + `manifest (
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
      this.storage.query( createTablePrx + `zones_acl (
                          is_deleted INTEGER,
                          is_tokens_acl INTEGER,
                          modified TEXT,
                          zone_acl_id TEXT PRIMARY KEY,
                          zone_id TEXT,
                          FOREIGN KEY(zone_id) REFERENCES zones(zone_id)
                        )` ),
      this.storage.query( createTablePrx + `zones_acl_passes (
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
      this.storage.query( createTablePrx + `zones_scanning_points (
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
      this.storage.query( createTablePrx + `orders_transactions (
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
                          FOREIGN KEY(manifest_id) REFERENCES manifest(manifest_id),
                          FOREIGN KEY(order_id) REFERENCES orders(order_id),
                          FOREIGN KEY(registrant_id) REFERENCES registrants(registrant_id)
                        )` ),
      this.storage.query( createTablePrx + `reports_contents (
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
      this.storage.query( createTablePrx + `schedules_segments (
                          is_active INTEGER,
                          is_deleted INTEGER,
                          modified TEXT,
                          scanning_schedule_id TEXT,
                          scanning_schedule_segment_id TEXT PRIMARY KEY,
                          segment_start TEXT,
                          segment_end TEXT,
                          FOREIGN KEY(scanning_schedule_id) REFERENCES schedules(scanning_schedule_id)
                        )` ),
      this.storage.query( createTablePrx + `scanning_exceptions (
                          exception_id TEXT PRIMARY KEY,
                          exception_name TEXT,
                          exception_desc TEXT,
                          modified TEXT,
                          is_deleted INTEGER,
                          is_active INTEGER
                        )` ),
      this.storage.query( createTablePrx + `scanning_exceptions_zones_acl(
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
   * Convert an object into an array of values
   * @param {Object} obj - object to convert
   * @returns {any[]}
   */
  private objToValuesArray(obj): any[] {
    return Object.keys(obj).map((key) => obj[key]);
  }

  /**
   * Convert an objects array into a values 2D-array
   * @param {Array} arrObjs - objects array to convert
   * @returns {any[][]}
   */
  private objsToValuesArray(arrObjs: any[]): any[] {
    return arrObjs.map((obj) => this.objToValuesArray(obj));
  }

  /**
   * Insert an object into a table
   * @param {string} tableName - name of the table
   * @param {Object} obj - object to insert
   * @returns {Promise<any>}
   */
  insertInTable(tableName: string, obj: {}): Promise<any> {
    if(!obj)
      return;
    let values = this.objToValuesArray(obj);
    return this.storage.query(
      `INSERT INTO ${tableName} VALUES (${Array(values.length+1).join('?,').slice(0,-1)})`,
      values
    );
  }

  /**
   * Insert multiple objects (of the same type) into a table
   * @param {string} tableName - name of the table
   * @param {Object} arrObjs - objects array
   * @returns {Promise<any>}
   */
  batchInsertInTable(tableName: string, arrObjs: any[]): Promise<any> {
    if(!arrObjs.length)
      return;
    let values = this.objsToValuesArray(arrObjs);
    return this.storage.batch(
      `INSERT INTO ${tableName} VALUES (${Array(values[0].length + 1).join('?,').slice(0, -1)})`,
      values
    );
  }

  /**
   * Search for a ticket in the database
   * @param {string} ticketId - the ticket to search
   * @returns {Promise<OrderTransaction>}
   */
  searchForTicket(ticketId: string): Promise<OrderTransaction> {
    return this.storage.query(
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
   * @returns {Promise<OrderTransaction>}
   */
  searchForTicketByManifestId(manifestId: string): Promise<OrderTransaction> {
    return this.storage.query(
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
   * @returns {Promise<ManifestEntity>}
   */
  searchForCredential(credentialId: string): Promise<ManifestEntity> {
    return this.storage.query(
      'SELECT * FROM manifest WHERE manifest_id = ? LIMIT 1',
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
   * @returns {Promise<Registrant>}
   */
  searchForRegistrant(registrantId: string): Promise<Registrant> {
    return this.storage.query(
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
   * Cast random credentials/tickets objects to string array.
   * Each array value corresponds to the value of objects
   * specific property
   * @param rows - sql result row list
   * @param objProp - the objects property
   * @returns {Array} - string array of objects values
   */
  private castRndCredentialsTicketsToArr(rows, objProp: string): string[] {
    let objsVal = [];
    for(let i = 0; i < rows.length; i++) {
      if(rows.item(i).hasOwnProperty(objProp))
        objsVal.push(rows.item(i)[objProp]);
    }
    return objsVal;
  }

  /**
   * Select two random credentials from the database
   * @returns {Promise<string[]>} - string array containing manifest_id values
   */
  selectRandomCredentials(): Promise<string[]> {
    return this.storage.query(
      'SELECT manifest_id FROM manifest ORDER BY manifest_id LIMIT 2'
    )
      .then((result) => {
        return this.castRndCredentialsTicketsToArr(
          result.res.rows,
          'manifest_id'
        );
      });
  }

  /**
   * Select two random tickets from the database
   * @return {Promise<string[]>} - string array containing transaction_id values
   */
  selectRandomTickets(): Promise<string[]> {
    return this.storage.query(
      'SELECT transaction_id FROM orders_transactions ORDER BY transaction_id LIMIT 2'
    )
      .then((result) => {
        return this.castRndCredentialsTicketsToArr(
          result.res.rows,
          'transaction_id'
        );
      });
  }

  /**
   * Clear the database
   * @returns {Promise<any>}
   */
  clear(): Promise<any> {
    return this.storage.clear();
  }

}
