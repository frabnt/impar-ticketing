import { deserializeAs } from "cerialize";
/**
 * Created by francesco on 25/10/2016.
 */

export class Registrant {
  @deserializeAs('name_first')
  nameFirst: string = undefined;
  @deserializeAs('name_last')
  nameLast: string = undefined;
  @deserializeAs('registrant_id')
  registrantId: string = undefined;
}
