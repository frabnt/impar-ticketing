import { deserializeAs, deserialize } from "cerialize";
/**
 * Created by francesco on 04/11/2016.
 */

export class Schedule {
  @deserializeAs('is_active')
  isActive: number = undefined;
  @deserializeAs('is_deleted')
  isDeleted: number = undefined;
  @deserialize
  modified: string = undefined;
  @deserializeAs('scanning_schedule_id')
  scanningScheduleId: string = undefined;
  @deserializeAs('schedule_name')
  scheduleName: string = undefined;
}
