import { AbstractSqlStorage } from "../sql-storage/abstract-sql-storage";
/**
 * Created by francesco on 08/11/2016.
 *
 */

export interface DatabaseFactory {
  /**
   * Create a different db object depending on specified conditions
   * @param {Object} options - any useful options to create db objects
   * @returns {AbstractSqlStorage} - db object
   */
  getDatabaseInstance(options): AbstractSqlStorage;
}
