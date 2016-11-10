import { JsonProperty } from "./decorators/json-property";
/**
 * Created by francesco on 25/10/2016.
 */

export class ZoneAcl {
  @JsonProperty({ name: 'is_deleted' })
  isDeleted: number = undefined;
  @JsonProperty({ name: 'is_tokens_acl' })
  isTokensAcl: number = undefined;
  modified: string = undefined;
  @JsonProperty({ name: 'zone_acl_id' })
  zoneAclId: string = undefined;
  @JsonProperty({ name: 'zone_id' })
  zoneId: string = undefined;
}
