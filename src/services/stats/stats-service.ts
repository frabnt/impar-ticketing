import { Injectable } from '@angular/core';
import localforage from 'localforage';
import { Stats } from "../../models/stats";

/*
  Generated class for the StatsService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
const DB_NAME: string = '_ionicstorage';
const STORE_NAME: string = '_ionickv';
const STATS_KEY: string = 'stats';

@Injectable()
export class StatsService {
  stats: Stats = new Stats();

  /**
   * @constructor
   */
  constructor() {
    localforage.config({
      name: DB_NAME,
      storeName: STORE_NAME // Should be alphanumeric, with underscores
    });
  }

  /**
   * Store stats
   * @param {Stats} stats - the Stats object to store
   * @returns {Promise<Stats>}
   */
  storeStats(): Promise<any> {
    return localforage.setItem(STATS_KEY, this.stats);
  }

  /**
   * Give back stored Stats object
   * @returns {Promise<T>}
   */
  getStats(): Promise<any> {
    return localforage.getItem(STATS_KEY);
  }

  /**
   * Delete stored Stats object from the storage
   * @returns {Promise<void>}
   */
  resetStats(): Promise<any> {
    return localforage.removeItem(STATS_KEY);
  }

}
