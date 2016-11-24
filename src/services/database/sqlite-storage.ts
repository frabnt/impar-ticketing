import { AbstractSqlStorage } from "./abstract-sql-storage";
import { WindowRefService } from "../window-ref/window-ref-service";
import { ReflectiveInjector } from "@angular/core";
/**
 * Created by francesco on 04/11/2016.
 */

const DB_NAME: string = '__ionicstorage';
const isFunction = (val: any) => typeof val === 'function';
const isObject = (val: any) => typeof val === 'object';
const isArray = Array.isArray;

export class SQLiteStorage extends AbstractSqlStorage {
  static BACKUP_LOCAL = 2;
  static BACKUP_LIBRARY = 1;
  static BACKUP_DOCUMENTS = 0;
  private name: string;
  private location: number;
  // Inject WindowRefService dependency outside the constructor
  private winRef: WindowRefService = ReflectiveInjector
    .resolveAndCreate([WindowRefService])
    .get(WindowRefService);

  /**
   * @constructor
   * @param {Object} options
   */
  constructor(options = {}) {
    super();

    let dbOptions = this.defaults(options, {
      name: DB_NAME,
      backupFlag: SQLiteStorage.BACKUP_LOCAL,
      existingDatabase: false
    });

    let location = this._getBackupLocation(dbOptions.backupFlag);
    this.location = location;
    this.name = dbOptions.name;

    this._db = this.winRef.nativeWindow.sqlitePlugin.openDatabase(this.assign({
      name: dbOptions.name,
      location: location,
      createFromLocation: dbOptions.existingDatabase ? 1 : 0
    }, dbOptions));
  }

  _getBackupLocation(dbFlag: number): number {
    switch (dbFlag) {
      case SQLiteStorage.BACKUP_LOCAL:
        return 2;
      case SQLiteStorage.BACKUP_LIBRARY:
        return 1;
      case SQLiteStorage.BACKUP_DOCUMENTS:
        return 0;
      default:
        throw Error('Invalid backup flag: ' + dbFlag);
    }
  }

  /**
   * Perform a batch query
   * @param {string} query - the query to be executed multiple times
   * @param {Array} objects - i-th item of array contains values need to be inserted in i-th query
   * @returns {Promise<T>|Promise}
   */
  batch(query:string, objects:any[]): Promise<any> {
    return new Promise((resolve, reject) => {
      this._db.sqlBatch(
        objects.map( (object) => [query, object] ),
        (res) => resolve({ res: res}),
        (err) => reject({ err: err })
      );
    });
  }

  /**
   * Delete the database
   */
  clear(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.winRef.nativeWindow.sqlitePlugin.deleteDatabase(
        {
          name: this.name,
          location: this.location
        },
        (res) => resolve({ res: res }),
        (err) => reject({ err: err })
      );
    });
  }

  assign(...args: any[]): any {
    if (typeof Object.assign !== 'function') {
      // use the old-school shallow extend method
      return this._baseExtend(args[0], [].slice.call(args, 1), false);
    }

    // use the built in ES6 Object.assign method
    return Object.assign.apply(null, args);
  }

  /**
   * Apply default arguments if they don't exist in
   * the first object.
   * @param the destination to apply defaults to.
   */
  defaults(dest: any, ...args: any[]) {
    for (var i = arguments.length - 1; i >= 1; i--) {
      var source = arguments[i];
      if (source) {
        for (var key in source) {
          if (source.hasOwnProperty(key) && !dest.hasOwnProperty(key)) {
            dest[key] = source[key];
          }
        }
      }
    }
    return dest;
  }

  _baseExtend(dst: any, objs: any, deep: boolean) {
    for (var i = 0, ii = objs.length; i < ii; ++i) {
      var obj = objs[i];
      if (!obj || !isObject(obj) && !isFunction(obj)) continue;
      var keys = Object.keys(obj);
      for (var j = 0, jj = keys.length; j < jj; j++) {
        var key = keys[j];
        var src = obj[key];

        if (deep && isObject(src)) {
          if (!isObject(dst[key])) dst[key] = isArray(src) ? [] : {};
          this._baseExtend(dst[key], [src], true);
        } else {
          dst[key] = src;
        }
      }
    }

    return dst;
  }
}
