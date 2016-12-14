import { AbstractSqlStorage } from "../sql-storage/abstract-sql-storage";
import { WebSQLStorage } from "../sql-storage/websql-storage";
import {DatabaseFactory} from "./database-factory";
/**
 * Created by francesco on 14/12/2016.
 */

export class MockDatabaseFactory implements DatabaseFactory {
  getDatabaseInstance(options): AbstractSqlStorage {
    return new WebSQLStorage(options.name);
  }
}
