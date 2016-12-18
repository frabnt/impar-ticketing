import { DecoratorSerDesService } from "./decorator-ser-des-service";
import { MOCK_MANIFEST, MOCK_TICKETS } from "../vfs-api/mock-data";
import { Manifest } from "../../models/manifest";
import * as cerialize from "cerialize";
import { Tickets } from "../../models/tickets";
import { Event } from "../../models/event";
/**
 * Created by francesco on 13/12/2016.
 */

describe('Services: decorator-ser-des-service', () => {

  let serDesService: DecoratorSerDesService;

  beforeEach(() => {
    serDesService = new DecoratorSerDesService();
  });

  it('should deserialize objects using cerialize module', () => {
    spyOn(cerialize, 'Deserialize');

    expect(
      serDesService.deserialize(MOCK_MANIFEST, Manifest)
    )
      .toEqual( cerialize.Deserialize(MOCK_MANIFEST, Manifest) );

    expect(
      serDesService.deserialize(MOCK_TICKETS, Tickets)
    )
      .toEqual( cerialize.Deserialize(MOCK_TICKETS, Tickets) );

    expect(cerialize.Deserialize).toHaveBeenCalledTimes(4);
  });

  it('should serialize the object using cerialize module', () => {
    let event = new Event();
    event.dateEnd = 'date-start';
    event.dateStart = 'date-start';
    event.eventId = 'event-id';
    event.eventName = 'event-name';
    event.timezone = 'timezone';

    spyOn(cerialize, 'Serialize');

    expect(
      serDesService.serialize(event)
    )
      .toEqual(cerialize.Serialize(event));

    expect(cerialize.Serialize).toHaveBeenCalledTimes(2);
  });

});
