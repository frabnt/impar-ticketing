import { deserializeAs, deserialize } from "cerialize";
import { DateHelper } from "./utils/date-helper";
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

  static OnDeserialized(instance : CredentialType, json : any) : void {
    let check = DateHelper.compareDateWithMarker(instance.deleted, json['is_deleted']);
    if(check)
      console.warn(`Credential (id -> ${instance.credentialTypeId}) ${check}`);
  }
}
