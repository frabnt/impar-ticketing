import { Manifest } from "../../models/manifest";
import { Tickets } from "../../models/tickets";
/**
 * Created by francesco on 22/12/2016.
 */

export class MockDBMappingService {
  mapManifestData(manifest: Manifest): Promise<any> {
    return Promise.resolve();
  }

  mapTicketsData(tickets: Tickets): Promise<any> {
    return Promise.resolve();
  }
}
