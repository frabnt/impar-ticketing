import { JsonProperty } from "./decorators/json-property";
/**
 * Created by francesco on 25/10/2016.
 */

export class OrderTransaction {
  activated: string = undefined;
  @JsonProperty({ name: 'barcode_id' })
  barcodeId: string = undefined;
  @JsonProperty({ name: 'credential_type_id' })
  credentialTypeId: string = undefined;
  deactivated: string = undefined;
  @JsonProperty({ name: 'deactivation_reason' })
  deactivationReason: string = undefined;
  deleted: string = undefined;
  identifier: string = undefined;
  @JsonProperty({ name: 'last_scan_mode' })
  lastScanMode: string = undefined;
  @JsonProperty({ name: 'manifest_id' })
  manifestId: string = undefined;
  modified: string = undefined;
  @JsonProperty({ name: 'one_day' })
  oneDay: string = undefined;
  @JsonProperty({ name: 'order_id' })
  orderId: string = undefined;
  @JsonProperty({ name: 'registrant_id' })
  registrantId: string = undefined;
  @JsonProperty({ name: 'scan_status' })
  scanStatus: number = undefined;
  @JsonProperty({ name: 'tokens_granted' })
  tokensGranted: number = undefined;
  @JsonProperty({ name: 'tokens_used' })
  tokensUsed: number = undefined;
  @JsonProperty({ name: 'transaction_id' })
  transactionId: string = undefined;
  @JsonProperty({ name: 'transaction_type' })
  transactionType: string = undefined;
  voided: string = undefined;
}

