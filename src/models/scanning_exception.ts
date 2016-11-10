import { JsonProperty } from "./decorators/json-property";
/**
 * Created by francesco on 04/11/2016.
 */

export class ScanningException {
  @JsonProperty({ name: 'exception_id' })
  exceptionId: string = undefined;
  @JsonProperty({ name: 'exception_name' })
  exceptionName: string = undefined;
  @JsonProperty({ name: 'exception_desc' })
  exceptionDesc: string = undefined;
  modified: string = undefined;
  @JsonProperty({ name: 'is_deleted' })
  isDeleted: number = undefined;
  @JsonProperty({ name: 'is_active' })
  isActive: number = undefined;
}
