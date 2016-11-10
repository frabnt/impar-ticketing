import { JsonProperty } from "./decorators/json-property";
/**
 * Created by francesco on 25/10/2016.
 */

export class Registrant {
  @JsonProperty({ name: 'name_first' })
  nameFirst: string = undefined;
  @JsonProperty({ name: 'name_last' })
  nameLast: string = undefined;
  @JsonProperty({ name: 'registrant_id' })
  registrantId: string = undefined;
}
