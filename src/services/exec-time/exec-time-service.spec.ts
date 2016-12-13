import { ExecTimeService } from "./exec-time-service";
/**
 * Created by francesco on 29/11/2016.
 */

describe('Services: Exec-time-service', () => {

  let execTimeService: ExecTimeService;

  beforeEach(() => {
    execTimeService = new ExecTimeService();
  });

  it('should create exec time service', () => {
    expect(execTimeService).not.toBeNull();
  });

  it('should return the time linked to the key if the key exists', () => {
    execTimeService.setTime('testTime', 1000);
    expect(execTimeService.getTime('testTime')).toBe(1000);
  });

  it('should return undefined if the key does not exist', () => {
    expect(execTimeService.getTime('testTime')).toBeUndefined();
  });

  it('should call getTime method of Date object twice', () => {
    spyOn(Date.prototype, 'getTime');
    execTimeService.endCounting( execTimeService.startCounting() );
    expect(Date.prototype.getTime).toHaveBeenCalledTimes(2);
  });

});
