import { Deserialize } from "cerialize";
import { MOCK_MANIFEST, MOCK_TICKETS } from "./mock-data";
import { Manifest } from "../../models/manifest";
import { Tickets } from "../../models/tickets";
/**
 * Created by francesco on 19/12/2016.
 */

export class MockVfsApiService {

  storeCredentials(apiToken: string, eventID: string): Promise<string[]> {
    return Promise.resolve([apiToken, eventID]);
  }

  getCredentials(): Promise<string[]> {
    return Promise.resolve(['apiToken, eventID']);
  }

  resetCredentials(): Promise<any> {
    return Promise.resolve();
  }

  doLogin(accessCode: string): Promise<any> {
    return Promise.resolve(['apiToken', 'eventID']);
  }

  doLogout(): Promise<any> {
    return Promise.resolve();
  }

  getManifest(): Promise<Manifest> {
    return Promise.resolve(
      Deserialize(MOCK_MANIFEST, Manifest)
    );
  }

  getTickets(page: number, items: number = 20000): Promise<Tickets> {
    return Promise.resolve(
      Deserialize(MOCK_TICKETS, Tickets)
    );
  }

  getAllTickets(items?: number): Promise<Tickets> {
    return Promise.resolve(
      Deserialize(MOCK_TICKETS, Tickets)
    );
  }

}
