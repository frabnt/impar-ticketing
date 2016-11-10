import { JsonProperty } from './decorators/json-property';
import { Order } from './order';
import { OrderTransaction } from './order_transaction';
/**
 * Created by francesco on 06/11/2016.
 */

export class Tickets {
  @JsonProperty({ clazz: Order})
  orders: Order[] = undefined;
  @JsonProperty({
    name: 'orders_transactions',
    clazz: OrderTransaction
  })
  ordersTransactions: OrderTransaction[] = undefined;
}
