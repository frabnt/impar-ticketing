import { deserializeAs, deserialize } from "cerialize";
/**
 * Created by francesco on 04/11/2016.
 */

export class ScanningException {
  @deserializeAs('exception_id')
  exceptionId: string = undefined;
  @deserializeAs('exception_name')
  exceptionName: string = undefined;
  @deserializeAs('exception_desc')
  exceptionDesc: string = undefined;
  @deserialize
  modified: string = undefined;
  @deserializeAs('is_deleted')
  isDeleted: number = undefined;
  @deserializeAs('is_active')
  isActive: number = undefined;
}
