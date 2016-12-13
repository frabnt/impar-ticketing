import { WindowRefService } from "./window-ref-service";
/**
 * Created by francesco on 29/11/2016.
 */

describe('Services: Window-ref-service', () => {
  let windowRefService: WindowRefService;

  beforeEach(() => {
    windowRefService = new WindowRefService();
  });

  it('should return the native window object', () => {
    expect(windowRefService.nativeWindow).toBe(window);
  });
});
