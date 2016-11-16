import { deserializeAs, deserialize } from "cerialize";
/**
 * Created by francesco on 25/10/2016.
 */

export class Zone {
  @deserializeAs('is_active')
  isActive: number = undefined;
  @deserializeAs('is_deleted')
  isDeleted: number = undefined;
  @deserializeAs('is_multipeer')
  isMultipeer: number = undefined;
  @deserialize
  modified: string = undefined;
  @deserializeAs('zone_id')
  zoneId: string = undefined;
  @deserializeAs('zone_name')
  zoneName: string = undefined;
}
