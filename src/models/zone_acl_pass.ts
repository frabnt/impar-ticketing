import { deserializeAs, deserialize } from "cerialize";
/**
 * Created by francesco on 25/10/2016.
 */

export class ZoneAclPass {
  @deserializeAs('credential_type_id')
  credentialTypeId: string = undefined;
  @deserializeAs('is_active')
  isActive: number = undefined;
  @deserializeAs('is_deleted')
  isDeleted: number = undefined;
  @deserializeAs('is_scheduled')
  isScheduled: number = undefined;
  @deserialize
  modified: string = undefined;
  @deserializeAs('scan_type')
  scanType: string = undefined;
  @deserializeAs('scanning_schedule_id')
  scanningScheduleId: string = undefined;
  @deserializeAs('zone_acl_id')
  zoneAclId: string = undefined;
  @deserializeAs('zone_acl_pass_id')
  zoneAclPassId: string = undefined;
}
