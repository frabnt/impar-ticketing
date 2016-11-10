import 'reflect-metadata';
import { JsonMetadata } from './json-metadata';
/**
 * Created by francesco on 03/11/2016.
 */

const jsonMetadataKey = "jsonProperty";

export function JsonProperty<T>(metadata?: JsonMetadata<T> | string): any {
  // If metadata is a string, it simply represents the json
  // property corresponding to the object property
  if (metadata instanceof String || typeof metadata === "string"){
    return Reflect.metadata(jsonMetadataKey, {
      name: metadata,
      clazz: undefined
    });
  } else {
    // If parameter is not a string, it should be
    // an object of type JsonMetadata
    let metadataObj = <JsonMetadata<T>>metadata;
    return Reflect.metadata(jsonMetadataKey, {
      name: metadataObj ? metadataObj.name : undefined,
      clazz: metadataObj ? metadataObj.clazz : undefined
    });
  }
}


