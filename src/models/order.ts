import { deserializeAs, deserialize } from "cerialize";
import { DateHelper } from "./utils/date-helper";
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

  static OnDeserialized(instance : Order, json : any) : void {
    let check = DateHelper.compareDateWithMarker(instance.deleted, json['is_deleted']);
    if(check)
      console.warn(`Order (id -> ${instance.orderId}) ${check}`);
  }
}
