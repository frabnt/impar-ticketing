import { deserializeAs } from "cerialize";
import { Order } from './order';
import { OrderTransaction } from './order_transaction';
import { Pagination } from './pagination';
/**
 * Created by francesco on 06/11/2016.
 */

export class Tickets {
  @deserializeAs(Order)
  orders: Order[] = undefined;
  @deserializeAs(
    OrderTransaction,
    'orders_transactions'
  )
  ordersTransactions: OrderTransaction[] = undefined;
  @deserializeAs(Pagination)
  pagination: Pagination = undefined;

  pushTickets(newTickets: Tickets) {
    Array.prototype.push.apply(
      this.orders,
      newTickets.orders
    );
    Array.prototype.push.apply(
      this.ordersTransactions,
      newTickets.ordersTransactions
    );
  }
}
