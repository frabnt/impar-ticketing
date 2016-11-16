import { deserializeAs, deserialize } from "cerialize";
/**
 * Created by francesco on 25/10/2016.
 */

export class ZoneScanningPoint {
  @deserializeAs('is_active')
  isActive: number = undefined;
  @deserializeAs('is_deleted')
  isDeleted: number = undefined;
  @deserialize
  modified: string = undefined;
  @deserializeAs('scan_direction')
  scanDirection: string = undefined;
  @deserializeAs('scanning_point_id')
  scanningPointId: string = undefined;
  @deserializeAs('scanpoint_name')
  scanpointName: string = undefined;
  @deserializeAs('zone_acl_id')
  zoneAclId: string = undefined;
  @deserializeAs('zone_id')
  zoneId: string = undefined;
}
