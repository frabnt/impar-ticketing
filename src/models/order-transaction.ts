import { deserialize, deserializeAs } from "cerialize";
import { DateHelper } from "./utils/date-helper";
/**
 * Created by francesco on 25/10/2016.
 */

export class OrderTransaction {
  @deserialize
  activated: string = undefined;
  @deserializeAs('barcode_id')
  barcodeId: string = undefined;
  @deserializeAs('credential_type_id')
  credentialTypeId: string = undefined;
  @deserialize
  deactivated: string = undefined;
  @deserializeAs('deactivation_reason')
  deactivationReason: string = undefined;
  @deserialize
  deleted: string = undefined;
  @deserialize
  identifier: string = undefined;
  @deserializeAs('last_scan_mode')
  lastScanMode: string = undefined;
  @deserializeAs('manifest_id')
  manifestId: string = undefined;
  @deserialize
  modified: string = undefined;
  @deserializeAs('one_day')
  oneDay: string = undefined;
  @deserializeAs('order_id')
  orderId: string = undefined;
  @deserializeAs('registrant_id')
  registrantId: string = undefined;
  @deserializeAs('scan_status')
  scanStatus: number = undefined;
  @deserializeAs('tokens_granted')
  tokensGranted: number = undefined;
  @deserializeAs('tokens_used')
  tokensUsed: number = undefined;
  @deserializeAs('transaction_id')
  transactionId: string = undefined;
  @deserializeAs('transaction_type')
  transactionType: string = undefined;
  @deserialize
  voided: string = undefined;

  static OnDeserialized(instance : OrderTransaction, json : any) : void {
    let check = DateHelper.compareDateWithMarker(instance.deleted, json['is_deleted']);
    if(check)
      console.warn(`Order transaction (id -> ${instance.transactionId}) ${check}`);
  }
}

