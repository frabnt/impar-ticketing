import { JsonMetadata } from "./json-metadata";
/**
 * Created by francesco on 09/11/2016.
 */

const jsonMetadataKey = "jsonProperty";

export class MapUtils {
  /**
   * Check if obj is a primitive data
   * @param obj
   * @returns {boolean}
   */
  private static isPrimitive(obj) {
    switch (typeof obj) {
      case "string":
      case "number":
      case "boolean":
        return true;
    }
    return !!(obj instanceof String || obj === String ||
    obj instanceof Number || obj === Number ||
    obj instanceof Boolean || obj === Boolean);
  }

  /**
   * Check if obj is an array
   * @param object
   * @returns {any}
   */
  private static isArray(object) {
    if (object === Array) {
      return true;
    } else if (typeof Array.isArray === "function") {
      return Array.isArray(object);
    }
    else {
      return !!(object instanceof Array);
    }
  }

  /**
   * Give back the class linked to obj prop
   * @param target - the object
   * @param propertyKey - the object property
   * @returns {any}
   */
  private static getClazz(target: any, propertyKey: string): any {
    return Reflect.getMetadata("design:type", target, propertyKey);
  }

  /**
   * Give back metadata linked to obj prop
   * @param target - the object
   * @param propertyKey - the object property
   * @returns {any}
   */
  private static getJsonProperty<T>(target: any, propertyKey: string):  JsonMetadata<T> {
    return Reflect.getMetadata(jsonMetadataKey, target, propertyKey);
  }

  /**
   * Cast a json object into a "typed" object
   * @param clazz
   * @param {Object} jsonObject
   * @returns {any}
   */
  static deserialize<T>(clazz: { new(): T }, jsonObject) {
    if ((clazz === undefined) || (jsonObject === undefined)) return undefined;
    // Create the object of the given class
    let obj = new clazz();
    // Iterate over all object keys
    Object.keys(obj).forEach((key) => {
      let propertyMetadataFn: (JsonMetadata) => any = (propertyMetadata) => {
        // Get the name of metadata (if set)
        let propertyName = propertyMetadata.name || key;
        let innerJson = jsonObject ? jsonObject[propertyName] : undefined;
        // Get the type of the obj prop
        let clazz = MapUtils.getClazz(obj, key);
        if (MapUtils.isArray(clazz)) { // if the property type is an array
          if (propertyMetadata.clazz || MapUtils.isPrimitive(clazz)) { //if there is a class linked to the prop or its type is primitive
            if (innerJson && MapUtils.isArray(innerJson)) { //if also innerJson is an array
              // Method invoked recursively on innerJson items
              return innerJson.map(
                (item)=> MapUtils.deserialize(propertyMetadata.clazz, item)
              );
            } else {
              // In this case the property type is an array while innerJson is not an array (or it's undefined)
              return undefined;
            }
          } else {
            // Prop type is an array, but no class is linked to the property and prop type is not primitive.
            // Prop content is therefore set equal to innerJson
            return innerJson;
          }
        } else if (!MapUtils.isPrimitive(clazz)) {
          // If prop type is not an array and is not primitive,
          // the method is recursively invoked on innerJson
          return MapUtils.deserialize(clazz, innerJson);
        } else {
          return innerJson;
        }
      };

      // get the json prop linked to the obj prop (key)
      let propertyMetadata = MapUtils.getJsonProperty(obj, key);
      if (propertyMetadata) {
        obj[key] = propertyMetadataFn(propertyMetadata);
      } else { // no metadata associated with the key
        // If json object has the key, the object value
        // is set to the corresponding json obj value
        if (jsonObject && jsonObject[key] !== undefined) {
          obj[key] = jsonObject[key];
        }
      }
    });
    return obj;
  }
}
