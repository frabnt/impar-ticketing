import { OrderTransaction } from "./order-transaction";
import { ManifestEntity } from "./manifest-entity";
import { Registrant } from "./registrant";
/**
 * Created by francesco on 28/11/2016.
 */

export class ScanResult {
  dbString: string;
  ticket: OrderTransaction;
  manifest: ManifestEntity;
  registrant: Registrant;
  isSearchSuccessful: boolean;

  constructor() {}
}
