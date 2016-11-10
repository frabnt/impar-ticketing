import { Injectable } from '@angular/core';
import localforage from 'localforage';

/*
  Generated class for the SettingsService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
const DB_NAME: string = '_ionicstorage';
const STORE_NAME: string = '_ionickv';
const ACCESS_CODES_KEY: string = 'access_codes';

@Injectable()
export class SettingsService {

  /**
   * Init storage
   * @constructor
   * @param http
   */
  constructor() {
    localforage.config({
      name: DB_NAME,
      storeName: STORE_NAME // Should be alphanumeric, with underscores
    });
  }

  /**
   * Retrieve stored access codes
   * @returns {Promise<T>}
   */
  getAccessCodesList(): Promise<string[]> {
    return localforage.getItem(ACCESS_CODES_KEY);
  }

  /**
   * Set access codes list in the storage
   * @param {string[]} accessCodeList - the list to be stored
   * @returns {Promise<string[]>}
   */
  setAccessCodesList(accessCodesList: string[]): Promise<any> {
    return localforage.setItem(ACCESS_CODES_KEY, accessCodesList);
  }

  /**
   * Remove access code list from the storage
   * @returns {Promise<void>}
   */
  removeAccessCodes(): Promise<any> {
    return localforage.removeItem(ACCESS_CODES_KEY);
  }


  /**
   * Store the (vfs) api token in the storage
   * @param {string} apiToken
   * @returns {Promise<string>}
   */
  setApiToken(apiToken: string): Promise<any> {
    return localforage.setItem('apiToken', apiToken);
  }

  /**
   * Give back the api token
   * @returns {Promise<T>}
   */
  getApiToken(): Promise<any> {
    return localforage.getItem('apiToken');
  }

  /**
   * Remove the api token from the storage
   * @returns {Promise<void>}
   */
  resetApiToken(): Promise<any> {
    return localforage.removeItem('apiToken');
  }

  /**
   * Store the event ID in the storage
   * @param {string} eventID
   * @returns {Promise<string>}
   */
  setEventID(eventID: string): Promise<any> {
    return localforage.setItem('eventID', eventID);
  }

  /**
   * Give back the event ID
   * @returns {Promise<T>}
   */
  getEventID(): Promise<any> {
    return localforage.getItem('eventID');
  }

  /**
   * Remove the event ID from the storage
   * @returns {Promise<void>}
   */
  resetEventID(): Promise<any> {
    return localforage.removeItem('eventID');
  }

  /**
   * Clear the storage
   * @returns {Promise<void>}
   */
  clear(): Promise<any> {
    return localforage.clear();
  }

}
