import { JsonProperty } from "./decorators/json-property";
/**
 * Created by francesco on 25/10/2016.
 */

export class Event {
  @JsonProperty({ name: 'date_end' })
  dateEnd: string = undefined;
  @JsonProperty({ name: 'date_start' })
  dateStart: string = undefined;
  @JsonProperty({ name: 'event_description' })
  eventDescription: string = undefined;
  @JsonProperty({ name: 'event_id' })
  eventId: string = undefined;
  @JsonProperty({ name: 'event_name' })
  eventName: string = undefined;
  timezone: string = undefined;
}
