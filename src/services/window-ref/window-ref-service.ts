import { Injectable } from '@angular/core';
/**
 * Created by francesco on 23/11/2016.
 */

function _window() : any {
  // return the global native browser window object
  return window;
}

@Injectable()
export class WindowRefService {

  get nativeWindow(): any {
    return _window();
  }

}
