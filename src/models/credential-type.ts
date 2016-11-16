import { deserializeAs, deserialize } from "cerialize";
/**
 * Created by francesco on 25/10/2016.
 */

export class CredentialType {
  @deserializeAs('credential_desc')
  credentialDesc: string  = undefined;
  @deserializeAs('credential_name')
  credentialName: string  = undefined;
  @deserializeAs('credential_type')
  credentialType: string = undefined;
  @deserializeAs('credential_type_id')
  credentialTypeId: string = undefined;
  @deserialize
  deleted: string = undefined;
  @deserializeAs('is_active')
  isActive: number = undefined;
  @deserializeAs('is_any_uid')
  isAnyUid: number = undefined;
  @deserializeAs('is_one_day')
  isOneDay: number = undefined;
  @deserialize
  modified: string = undefined;
  @deserializeAs('tokens_granted')
  tokensGranted: number = undefined;
  @deserializeAs('validation_type')
  validationType: string = undefined;
}
