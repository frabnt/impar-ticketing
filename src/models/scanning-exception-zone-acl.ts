import { deserializeAs, deserialize } from "cerialize";
/**
 * Created by francesco on 04/11/2016.
 */

export class ScanningExceptionZoneAcl {
  @deserializeAs('exception_zone_id')
  exceptionZoneId: string = undefined;
  @deserializeAs('exception_id')
  exceptionId: string = undefined;
  @deserializeAs('zone_acl_id')
  zoneAclId: string = undefined;
  @deserialize
  modified: string = undefined;
  @deserializeAs('is_deleted')
  isDeleted: number = undefined;
  @deserializeAs('is_active')
  isActive: number = undefined;
}
