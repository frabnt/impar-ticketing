import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
/**
 * Created by francesco on 23/11/2016.
 */


@Injectable()
export class LocalStorageService {
  constructor(private storage: Storage) {}

  /**
   * Get the value associated with the given key
   * @param key - the key associated with the value
   * @returns {Promise<any>} that resolve with the value
   */
  get(key: string): Promise<any> {
    return this.hasKey(key)
      .then(res => {
        if(res)
          return this.storage.get(key);
        return;
      })
  }

  /**
   * Set the value for the given key
   * @param key - the key associated with the value
   * @param value - the value for the key
   * @returns {Promise<any>} that resolve when the value is set
   */
  set(key: string, value: any): Promise<any> {
    return this.storage.set(key, value);
  }

  /**
   * Remove any value associated with the given key
   * @param key - the key to identify this value
   * @returns {Promise<any>} that resolves when the value is removed
   */
  remove(key: string): Promise<any> {
    return this.storage.remove(key);
  }

  /**
   * Check if the key is in the storage
   * @param key - the key to search
   * @returns {Promise<boolean>} that resolves with the result of the check
   */
  hasKey(key: string): Promise<boolean> {
    return this.storage.keys()
      .then(keys => {
        return keys.indexOf(key) > -1;
      })
  }
}
