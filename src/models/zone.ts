import { JsonProperty } from "./decorators/json-property";
/**
 * Created by francesco on 25/10/2016.
 */

export class Zone {
  @JsonProperty({ name: 'is_active' })
  isActive: number = undefined;
  @JsonProperty({ name: 'is_deleted' })
  isDeleted: number = undefined;
  @JsonProperty({ name: 'is_multipeer' })
  isMultipeer: number = undefined;
  modified: string = undefined;
  @JsonProperty({ name: 'zone_id' })
  zoneId: string = undefined;
  @JsonProperty({ name: 'zone_name' })
  zoneName: string = undefined;
}
