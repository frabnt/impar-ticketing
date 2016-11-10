import { JsonProperty } from "./decorators/json-property";
/**
 * Created by francesco on 25/10/2016.
 */

export class Order {
  @JsonProperty({ name: 'barcode_id' })
  barcodeId: string = undefined;
  deleted: string = undefined;
  modified: string = undefined;
  @JsonProperty({ name: 'order_id' })
  orderId: string = undefined;
}
