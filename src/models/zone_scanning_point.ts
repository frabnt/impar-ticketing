import { JsonProperty } from "./decorators/json-property";
/**
 * Created by francesco on 25/10/2016.
 */

export class ZoneScanningPoint {
  @JsonProperty({ name: 'is_active' })
  isActive: number = undefined;
  @JsonProperty({ name: 'is_deleted' })
  isDeleted: number = undefined;
  modified: string = undefined;
  @JsonProperty({ name: 'scan_direction' })
  scanDirection: string = undefined;
  @JsonProperty({ name: 'scanning_point_id' })
  scanningPointId: string = undefined;
  @JsonProperty({ name: 'scanpoint_name' })
  scanpointName: string = undefined;
  @JsonProperty({ name: 'zone_acl_id' })
  zoneAclId: string = undefined;
  @JsonProperty({ name: 'zone_id' })
  zoneId: string = undefined;
}
