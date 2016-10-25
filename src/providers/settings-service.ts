import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import localforage from 'localforage';

/*
  Generated class for the SettingsService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
const DB_NAME: string = 'ImParApp';
const STORE_NAME: string = 'local_settings';
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
   * @param accessCodeList {string[]} - the list to be stored
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
   * Clear the storage
   * @returns {Promise<void>}
   */
  clear(): Promise<any> {
    return localforage.clear();
  }

}
