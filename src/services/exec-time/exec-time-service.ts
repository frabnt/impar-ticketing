import { Injectable } from '@angular/core';
/**
 * Created by francesco on 21/11/2016.
 */

@Injectable()
export class ExecTimeService {
  private timesMap: Map<string, number> = new Map();

  /**
   * @constructor
   */
  constructor() { }

  /**
   * @returns {number} - number of milliseconds since 1970/01/01
   */
  startCounting(): number {
    return new Date().getTime();
  }

  /**
   * @param {number} startTime
   * @returns {number} - difference between current time and
   *                     start time expressed in milliseconds
   */
  endCounting(startTime: number): number {
    return new Date().getTime() - startTime;
  }

  /**
   * Set the time for the given key
   * @param {string|number} key
   * @param {any} value
   */
  setTime(key: string, value: number) {
    this.timesMap.set(key, value);
  }

  /**
   * Give back the time for the given key
   * @param {string|number} key
   * @returns {any} - the value for the given key undefined
   *                  if the key doesn't exist
   */
  getTime(key: string): any {
    return this.timesMap.get(key);
  }

}
