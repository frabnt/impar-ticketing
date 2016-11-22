import { deserializeAs } from "cerialize";
import { Order } from './order';
import { OrderTransaction } from './order-transaction';
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

  /**
   * Add an array of Tickets to this object
   * @param newTickets - the array of Tickets to add
   */
  pushTickets(newTickets: Tickets[]) {
    // Each Tickets of newTickets is added to this object
    newTickets.map(res => {
      // Adding orders
      this.orders.push(...res.orders);
      // Adding orders transactions
      this.ordersTransactions.push(...res.ordersTransactions);
    });
  }
}
