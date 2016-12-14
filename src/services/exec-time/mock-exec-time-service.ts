/**
 * Created by francesco on 13/12/2016.
 */

export class MockExecTimeService {
  private static TEST_KEYS: any[] = ['ticketsTime', 'manifestTime', 'dbStringSearchTime'];

  constructor() { }

  startCounting(): number {
    return 1000;
  }

  endCounting(startTime: number): number {
    return 2000;
  }

  setTime(key: string, value: number) {
    //do-nothing
  }

  getTime(key: string): number {
    if(MockExecTimeService.TEST_KEYS.indexOf(key) > -1)
      return 1000;
    return;
  }
}
