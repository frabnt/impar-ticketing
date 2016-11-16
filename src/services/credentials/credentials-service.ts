import { Injectable } from '@angular/core';
import localforage from 'localforage';
/*
  Generated class for the CredentialsService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
const DB_NAME: string = '_ionicstorage';
const STORE_NAME: string = '_ionickv';
const TOKEN_KEY: string = 'apiToken';
const EVENT_ID_KEY: string = 'eventID';

@Injectable()
export class CredentialsService {

  constructor() {
    localforage.config({
      name: DB_NAME,
      storeName: STORE_NAME // Should be alphanumeric, with underscores
    });
  }

  /**
   * Store the (vfs) api token in the storage
   * @param apiToken
   * @returns {Promise<string>}
   */
  setApiToken(apiToken: string): Promise<any> {
    return localforage.setItem(TOKEN_KEY, apiToken);
  }

  /**
   * Give back the api token
   * @returns {Promise<T>}
   */
  getApiToken(): Promise<any> {
    return localforage.getItem(TOKEN_KEY);
  }

  /**
   * Remove the api token from the storage
   * @returns {Promise<void>}
   */
  resetApiToken(): Promise<any> {
    return localforage.removeItem(TOKEN_KEY);
  }

  /**
   * Store the event ID in the storage
   * @param eventID
   * @returns {Promise<string>}
   */
  setEventID(eventID: string): Promise<any> {
    return localforage.setItem(EVENT_ID_KEY, eventID);
  }

  /**
   * Give back the event ID
   * @returns {Promise<T>}
   */
  getEventID(): Promise<any> {
    return localforage.getItem(EVENT_ID_KEY);
  }

  /**
   * Remove the event ID from the storage
   * @returns {Promise<void>}
   */
  resetEventID(): Promise<any> {
    return localforage.removeItem(EVENT_ID_KEY);
  }

}
