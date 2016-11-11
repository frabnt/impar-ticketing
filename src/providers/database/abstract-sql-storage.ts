/**
 * Created by francesco on 04/11/2016.
 */

export abstract class AbstractSqlStorage {
  protected _db: any;

  /**
   * Perform an arbitrary SQL operation on the database. Use this method
   * to have full control over the underlying database through SQL operations
   * like SELECT, INSERT, and UPDATE.
   *
   * @param {string} query - the query to run
   * @param {array} params - the additional params to use for query placeholders
   * @return {Promise} that resolves or rejects with an object of the form { tx: Transaction, res: Result (or err)}
   */
  query(query: string, params = []): Promise<any> {
    return new Promise((resolve, reject) => {
      this._db.transaction((tx) => {
          tx.executeSql(query, params,
            (tx, res) => resolve({ tx: tx, res: res }),
            (tx, err) => reject({ tx: tx, err: err }));
        },
        (err) => reject({ err: err }));
    });
  }

  /**
   * Perform a batch query
   * @param {string} query - the query to be executed multiple times
   * @param {Array} objects - i-th item of array contains values need to be inserted in i-th query
   * @returns {Promise<T>|Promise}
   */
  abstract batch(query: string, objects: any[]): Promise<any>;

  /**
   * Delete the database
   */
  abstract clear(): Promise<any>;
}
