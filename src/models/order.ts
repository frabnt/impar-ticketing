import { deserializeAs, deserialize } from "cerialize";
/**
 * Created by francesco on 25/10/2016.
 */

export class Order {
  @deserializeAs('barcode_id')
  barcodeId: string = undefined;
  @deserialize
  deleted: string = undefined;
  @deserialize
  modified: string = undefined;
  @deserializeAs('order_id')
  orderId: string = undefined;
}
