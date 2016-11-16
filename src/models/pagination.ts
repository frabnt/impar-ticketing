import { deserializeAs, deserialize } from "cerialize";
/**
 * Created by francesco on 16/11/2016.
 */

export class Pagination {
  @deserializeAs('current_page')
  currentPage: number = undefined;
  @deserializeAs('last_page')
  lastPage: number = undefined;
  @deserializeAs('per_page')
  perPage: number = undefined;
  @deserialize
  total: number = undefined;
}
