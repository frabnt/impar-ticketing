/**
 * Created by francesco on 11/11/2016.
 */

export class Stats {
  // total entities = total manifest + total tickets
  totalEntities: number = 0;
  totalManifest: number = 0;
  totalTickets: number = 0;
  // total time (ms) = manifest import time + tickets import time
  totalTime: number = 0;
  manifestTime: number = 0;
  ticketsTime: number = 0;

  /**
   * @constructor
   */
  constructor(){ }
}
