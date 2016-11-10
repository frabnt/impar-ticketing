import { JsonProperty } from "./decorators/json-property";
/**
 * Created by francesco on 25/10/2016.
 */

export class ManifestEntity {
  activated: string  = undefined;
  @JsonProperty({ name: 'credential_type_id' })
  credentialTypeId: string = undefined;
  deactivated: string = undefined;
  @JsonProperty({ name: 'deactivation_reason' })
  deactivationReason: string = undefined;
  @JsonProperty({ name: 'is_deleted' })
  isDeleted: number = undefined;
  @JsonProperty({ name: 'manifest_id' })
  manifestId: string = undefined;
  modified: string = undefined;
  @JsonProperty({ name: 'scan_code' })
  scanCode: string = undefined;
  @JsonProperty({ name: 'scan_status' })
  scanStatus: number = undefined;
  @JsonProperty({ name: 'validation_type' })
  validationType: string = undefined;
}
