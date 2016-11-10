import { JsonProperty } from "./decorators/json-property";
/**
 * Created by francesco on 04/11/2016.
 */

export class ScanningExceptionZoneAcl {
  @JsonProperty({ name: 'exception_zone_id' })
  exceptionZoneId: string = undefined;
  @JsonProperty({ name: 'exception_id' })
  exceptionId: string = undefined;
  @JsonProperty({ name: 'zone_acl_id' })
  zoneAclId: string = undefined;
  modified: string = undefined;
  @JsonProperty({ name: 'is_deleted' })
  isDeleted: number = undefined;
  @JsonProperty({ name: 'is_active' })
  isActive: number = undefined;
}
