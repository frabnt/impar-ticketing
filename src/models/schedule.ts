import { JsonProperty } from "./decorators/json-property";
/**
 * Created by francesco on 04/11/2016.
 */

export class Schedule {
  @JsonProperty({ name: 'is_active' })
  isActive: number = undefined;
  @JsonProperty({ name: 'is_deleted' })
  isDeleted: number = undefined;
  modified: string = undefined;
  @JsonProperty({ name: 'scanning_schedule_id' })
  scanningScheduleId: string = undefined;
  @JsonProperty({ name: 'schedule_name' })
  scheduleName: string = undefined;
}
