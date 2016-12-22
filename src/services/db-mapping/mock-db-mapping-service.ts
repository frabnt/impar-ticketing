import { Manifest } from "../../models/manifest";
import { Tickets } from "../../models/tickets";
/**
 * Created by francesco on 22/12/2016.
 */

export class MockDBMappingService {
  mapApiData(manifest: Manifest, tickets: Tickets): Promise<any> {
    return Promise.resolve();
  }
}
