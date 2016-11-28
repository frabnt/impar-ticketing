import { deserializeAs, deserialize } from "cerialize";
import { DateHelper } from "./utils/date-helper";
/**
 * Created by francesco on 25/10/2016.
 */

export class ManifestEntity {
  @deserialize
  activated: string  = undefined;
  @deserializeAs('credential_type_id')
  credentialTypeId: string = undefined;
  @deserialize
  deactivated: string = undefined;
  @deserializeAs('deactivation_reason')
  deactivationReason: string = undefined;
  @deserializeAs('is_deleted')
  isDeleted: number = undefined;
  @deserializeAs('manifest_id')
  manifestId: string = undefined;
  @deserialize
  modified: string = undefined;
  @deserializeAs('scan_code')
  scanCode: string = undefined;
  @deserializeAs('scan_status')
  scanStatus: number = undefined;
  @deserializeAs('validation_type')
  validationType: string = undefined;

  static OnDeserialized(instance : ManifestEntity, json : any) : void {
    let check = DateHelper.compareDateWithMarker(instance.activated, json['is_activated']);
    if(check)
      console.warn(`Credential (id -> ${instance.manifestId}) ${check}`);

    check = DateHelper.compareDateWithMarker(instance.deactivated, json['is_deactivated']);
    if(check)
      console.warn(`Credential (id -> ${instance.manifestId}) ${check}`);
  }
}
