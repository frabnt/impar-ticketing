import { deserializeAs, deserialize } from "cerialize";
/**
 * Created by francesco on 25/10/2016.
 */

export class ZoneAcl {
  @deserializeAs('is_deleted')
  isDeleted: number = undefined;
  @deserializeAs('is_tokens_acl')
  isTokensAcl: number = undefined;
  @deserialize
  modified: string = undefined;
  @deserializeAs('zone_acl_id')
  zoneAclId: string = undefined;
  @deserializeAs('zone_id')
  zoneId: string = undefined;
}
