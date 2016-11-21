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
  private stats: Stats = new Stats();

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
   * Set total number of tickets entities
   * @param total - tickets entities
   */
  setTotalTickets(total: number) {
    this.stats.totalTickets = total;
  }

  /**
   * Set total number of manifest entities
   * @param total - manifest entities
   */
  setTotalManifest(total: number) {
    this.stats.totalManifest = total;
  }

  /**
   * Set the time to perform tickets mapping
   * @param time
   */
  setTicketsTime(time: number) {
    this.stats.ticketsTime = time;
  }

  /**
   *
   * @returns {number} - the time to perform tickets mapping
   */
  getTicketsTime(): number {
    return this.stats.ticketsTime;
  }

  /**
   * Set the time to perform manifest mapping
   * @param time
   */
  setManifestTime(time: number) {
    this.stats.manifestTime = time;
  }

  /**
   * Set total number of entities ( = manifest entities + tickets entities )
   */
  updateTotalEntities() {
    this.stats.totalEntities =
      this.stats.totalManifest + this.stats.totalTickets;
  }

  /**
   * Set the time to perform both tickets and manifest mapping
   */
  updateTotalTime() {
    this.stats.totalTime =
      this.stats.manifestTime + this.stats.ticketsTime;
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
