import { JsonProperty } from "./decorators/json-property";
/**
 * Created by francesco on 25/10/2016.
 */

export class CredentialType {
  @JsonProperty({ name: 'credential_desc' })
  credentialDesc: string  = undefined;
  @JsonProperty({ name: 'credential_name' })
  credentialName: string  = undefined;
  @JsonProperty({ name: 'credential_type' })
  credentialType: string = undefined;
  @JsonProperty({ name: 'credential_type_id' })
  credentialTypeId: string = undefined;
  deleted: string = undefined;
  @JsonProperty({ name: 'is_active' })
  isActive: number = undefined;
  @JsonProperty({ name: 'is_any_uid' })
  isAnyUid: number = undefined;
  @JsonProperty({ name: 'is_one_day' })
  isOneDay: number = undefined;
  modified: string = undefined;
  @JsonProperty({ name: 'tokens_granted' })
  tokensGranted: number = undefined;
  @JsonProperty({ name: 'validation_type' })
  validationType: string = undefined;
}
