import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
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

  constructor(public http: Http) {
    localforage.config({
      name: DB_NAME,
      storeName: STORE_NAME // Should be alphanumeric, with underscores
    });
  }

  getAccessCodesList(): Promise<string[]> {
    return localforage.getItem(ACCESS_CODES_KEY);
  }

  setAccessCodesList(accessCodesList: string[]): Promise<any> {
    return localforage.setItem(ACCESS_CODES_KEY, accessCodesList);
  }

  removeAccessCodes(): Promise<any> {
    return localforage.removeItem(ACCESS_CODES_KEY);
  }

  clear(): Promise<any> {
    return localforage.clear();
  }

}
