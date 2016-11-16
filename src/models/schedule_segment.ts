import { deserializeAs, deserialize } from "cerialize";
/**
 * Created by francesco on 04/11/2016.
 */

export class ScheduleSegment {
  @deserializeAs('is_active')
  isActive: number = undefined;
  @deserializeAs('is_deleted')
  isDeleted: number = undefined;
  @deserialize
  modified: string = undefined;
  @deserializeAs('scanning_schedule_id')
  scanningScheduleId: string = undefined;
  @deserializeAs('scanning_schedule_segment_id')
  scanningScheduleSegmentId: string = undefined;
  @deserializeAs('segment_start')
  segmentStart: string = undefined;
  @deserializeAs('segment_end')
  segmentEnd: string = undefined;
}
