import { JsonProperty } from "./decorators/json-property";
/**
 * Created by francesco on 25/10/2016.
 */

export class ZoneAclPass {
  @JsonProperty({ name: 'credential_type_id' })
  credentialTypeId: string = undefined;
  @JsonProperty({ name: 'is_active' })
  isActive: number = undefined;
  @JsonProperty({ name: 'is_deleted' })
  isDeleted: number = undefined;
  @JsonProperty({ name: 'is_scheduled' })
  isScheduled: number = undefined;
  modified: string = undefined;
  @JsonProperty({ name: 'scan_type' })
  scanType: string = undefined;
  @JsonProperty({ name: 'scanning_schedule_id' })
  scanningScheduleId: string = undefined;
  @JsonProperty({ name: 'zone_acl_id' })
  zoneAclId: string = undefined;
  @JsonProperty({ name: 'zone_acl_pass_id' })
  zoneAclPassId: string = undefined;
}
