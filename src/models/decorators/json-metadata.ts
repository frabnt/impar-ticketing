/**
 * Created by francesco on 09/11/2016.
 */

export interface JsonMetadata<T> {
  // name of json property associated to object property
  name?: string,
  // class associated to the object property
  clazz?: { new(): T }
}
