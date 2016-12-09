/**
 * Created by francesco on 08/12/2016.
 */

export interface SerDes {

  /**
   * Deserialize a json object into a new instance of the given type
   * @param {any} json - the json obj to deserialize
   * @param {any} type - the type used for deserialization
   * @returns {any} - the json deserialized
   */
  deserialize(json: any, type?: any);

  /**
   * Serialize the given value into a stringified json object
   * @param {any} value - the value to serialize
   * @param {any} classType - the class of which the value must be
   *                          considered an instance of
   * @returns {any} - the value serialized
   */
  serialize(value: any, classType?: any);
}
