import { deserializeAs, deserialize } from "cerialize";
/**
 * Created by francesco on 25/10/2016.
 */

export class Event {
  @deserializeAs('date_end' )
  dateEnd: string = undefined;
  @deserializeAs('date_start')
  dateStart: string = undefined;
  @deserializeAs('event_description')
  eventDescription: string = undefined;
  @deserializeAs('event_id')
  eventId: string = undefined;
  @deserializeAs('event_name')
  eventName: string = undefined;
  @deserialize
  timezone: string = undefined;
}
