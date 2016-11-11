import { AbstractSqlStorage } from "./abstract-sql-storage";
import { SQLiteStorage } from "./sqlite-storage";
import { WebSQLStorage } from "./websql-storage";
import { winRef } from "../window-ref";

/**
 * Created by francesco on 08/11/2016.
 *
 */

export class DatabaseFactory {
  /**
   * Create a different db object depending on the execution platform
   * @param {Object} options - the object supports the following properties:
   *  {
   *    name: the name of the database (__ionicstorage by default)
   *    backupFlag: where to store the file; default is BACKUP_LOCAL which DOES NOT store to iCloud. Other options: BACKUP_LIBRARY, BACKUP_DOCUMENTS
   *    existingDatabase: whether to load this as an existing database (default is false)
   *  }
   * @returns {any} - db object
   */
  static getDatabaseInstance(options): AbstractSqlStorage {
    if( winRef().sqlitePlugin ) {
      return new SQLiteStorage(options);
    } else {
      return new WebSQLStorage(options.name);
    }
  }
}
