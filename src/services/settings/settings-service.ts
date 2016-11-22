import { Injectable } from '@angular/core';
import localForage from "localforage";

/*
  Generated class for the SettingsService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
const DB_NAME: string = '_ionicstorage';
const STORE_NAME: string = '_ionickv';
const ACCESS_CODES_KEY: string = 'accessCodes';

@Injectable()
export class SettingsService {

  /**
   * Init storage
   * @constructor
   * @param http
   */
  constructor() {
    localForage.config({
      name: DB_NAME,
      storeName: STORE_NAME // Should be alphanumeric, with underscores
    });
  }

  /**
   * Retrieve stored access codes
   * @returns {Promise<string[]>}
   */
  getAccessCodesList(): Promise<string[]> {
    return localForage.getItem<string[]>(ACCESS_CODES_KEY);
  }

  /**
   * Set access codes list in the storage
   * @param accessCodeList {string[]} - the list to be stored
   * @returns {Promise<string[]>}
   */
  setAccessCodesList(accessCodesList: string[]): Promise<string[]> {
    return localForage.setItem<string[]>(ACCESS_CODES_KEY, accessCodesList);
  }

  /**
   * Remove access code list from the storage
   * @returns {Promise<void>}
   */
  removeAccessCodes(): Promise<any> {
    return localForage.removeItem(ACCESS_CODES_KEY);
  }

}
