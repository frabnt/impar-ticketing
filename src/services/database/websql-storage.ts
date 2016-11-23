import { AbstractSqlStorage } from "./abstract-sql-storage";
import { WindowRefService } from "../window-ref/window-ref-service";
import { ReflectiveInjector } from "@angular/core";

/**
 * Created by francesco on 04/11/2016.
 */

export class WebSQLStorage extends AbstractSqlStorage {
  // Inject WindowRefService dependency outside the constructor
  private winRef: WindowRefService = ReflectiveInjector
    .resolveAndCreate([WindowRefService])
    .get(WindowRefService);

  /**
   * @constructor
   * @param {string} name - the name of database
   */
  constructor(name) {
    super();
    this._db = this.winRef.nativeWindow.openDatabase(name, '1.0', 'database', 5 * 1024 * 1024);
  }

  /**
   * Perform multiple query in a single transaction
   * (not properly a batch query 'cause is not supported by WebSQL)
   * @param {string} query - the query to be executed multiple times
   * @param {Array} objects - i-th item of array contains values need to be inserted in i-th query
   * @returns {Promise<T>|Promise}
   */
  batch(query: string, objects: any[]): Promise<any> {
    return new Promise((resolve, reject) => {
      this._db.transaction((tx) => {
        let count = 0;
        objects.map((object) => {
          tx.executeSql(query, object,
            (tx, res) => {
              count++;
              if(count == objects.length) {
                resolve({tx: tx, res: res})
              }
            },
            (tx, err) => reject( {tx: tx, err: err}) )
        });
      },
      (err) => reject({ err: err }));
    });
  }

  /**
   * Delete the database
   */
  clear(): Promise<any> {
    let deleteQuery = "SELECT * FROM sqlite_master WHERE name NOT LIKE 'sqlite\\_%' escape '\\' AND name NOT LIKE '\\_%' escape '\\'";
    return this.query(deleteQuery).then((result) => {
      let tableNames: string[] = [];
      for(let i = 0; i < result.res.rows.length; i++) {
        tableNames.push(result.res.rows[i].name);
      }
      return Promise.all(
        tableNames.map((table) => {
          return this.query(`DROP TABLE ${table}`);
        })
      );
    });
  }
}
