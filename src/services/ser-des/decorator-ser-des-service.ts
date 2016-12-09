import { SerDes } from "./ser-des";
import { Injectable } from "@angular/core";
import { Deserialize, Serialize } from "cerialize";
/**
 * Created by francesco on 08/12/2016.
 */

@Injectable()
export class DecoratorSerDesService implements SerDes {

  /**
   * Deserialize a json object into a new instance of the given type.
   * It takes the provided type and pulls out the properties tagged
   * with decorators, recursively pumping them into a new instance of
   * that type.
   * For further info visit 'Deserializing Into New Instances' section
   * at: https://github.com/weichx/cerialize
   *
   * @param {any} json - the json obj to deserialize
   * @param {any} type - the type used for deserialization
   * @returns {any} - the json deserialized
   */
  deserialize(json: any, type?: any) {
    return Deserialize(json, type);
  }

  /**
   * Serialize the given value into a pre-stringified json object:
   *  - If the value is an array, the serialization is called recursively
   *    on each array items
   *  - If the value is a primitive, it will be returned as it is
   *  - If the value is undefined, the serialization method return null
 *    - If a classType is given, the value is considered an instance of this
   *    class. Only object properties marked with a serialization annotations
   *    will be serialized. If there are any object properties not marked for
   *    serialization, all keys in that object will be serialized as primitives
   * For further information visit 'Serializing Objects' section of:
   * https://github.com/weichx/cerialize
   *
   * @param {any} value - the value to serialize
   * @param {any} classType - the class of which the value must be
   *                          considered an instance of
   * @returns {any} - the value serialized
   */
  serialize(value, classType?) {
    return Serialize(value, classType);
  }

}
