import { Injectable } from '@angular/core';
/**
 * Created by francesco on 21/11/2016.
 */

@Injectable()
export class ExecTimeService {

  constructor() { }

  /**
   *
   * @returns {number} - number of milliseconds since 1970/01/01
   */
  startCounting(): number {
    return new Date().getTime();
  }

  /**
   *
   * @param startTime
   * @returns {number} - difference between current time
   * and start time expressed in milliseconds
   */
  endCounting(startTime: number): number {
    return new Date().getTime() - startTime;
  }

}
