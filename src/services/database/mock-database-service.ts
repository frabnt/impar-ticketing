import { OrderTransaction } from "../../models/order-transaction";
import { ManifestEntity } from "../../models/manifest-entity";
import { Registrant } from "../../models/registrant";
/**
 * Created by francesco on 13/12/2016.
 */

const DB_NAME: string = 'mock_database';

export class MockDatabaseService {

  constructor() { }

  openDatabase(dbName: string = DB_NAME): Promise<any> {
    return Promise.resolve();
  }

  enableForeignKey(): Promise<any> {
    return Promise.resolve({res: 'res'});
  }

  createTables(): Promise<any> {
    return Promise.resolve({res: 'res'});
  }

  insertInTable(tableName: string, obj: {}): Promise<any> {
    return Promise.resolve({res: 'res'});
  }

  batchQuery(tableName: string, arrObjs: any[]): Promise<any> {
    return Promise.resolve({res: 'res'});
  }

  chunkedBatchInsert(tableName: string, arrObjs: any[]): Promise<any> {
    return Promise.resolve({res: 'res'});
  }

  searchForTicket(ticketId: string): Promise<OrderTransaction> {
    let ticket: OrderTransaction = new OrderTransaction();
    return Promise.resolve(ticket);
  }

  searchForTicketByManifestId(manifestId: string): Promise<OrderTransaction> {
    let ticket: OrderTransaction = new OrderTransaction();
    return Promise.resolve(ticket);
  }

  searchForCredential(credentialId: string): Promise<ManifestEntity> {
    let credential: ManifestEntity = new ManifestEntity();
    return Promise.resolve(credential);
  }

  searchForRegistrant(registrantId: string): Promise<Registrant> {
    let registrant: Registrant = new Registrant();
    return Promise.resolve(registrant);
  }

  selectRandomCredentials(): Promise<string[]> {
    return Promise.resolve([
      'credential-1',
      'credential-2'
    ]);
  }

  selectRandomTickets(): Promise<string[]> {
    return Promise.resolve([
      'ticket-1',
      'ticket-2'
    ]);
  }

  calculateStats(): Promise<number[]> {
    return Promise.resolve([2, 1, 1]);
  }

  clear(): Promise<any> {
    return Promise.resolve();
  }

  query(query: string, params = []): Promise<any> {
    return Promise.resolve();
  }

}
