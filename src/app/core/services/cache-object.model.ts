/**
 * An object to be stored in the cache
 */
export class CacheObject<T> {
  /**
   *  Constructs an object ready to be stored in the cache
   *
   * @param object the object to be stored
   * @param expiryInDays the days the cached data is valid
   */
  constructor(object: T, expiryInDays = 1) {
    this.object = object;
    this.expire = new Date();
    this.expire.setDate(this.expire.getDate() + expiryInDays);
  }

  object: T;
  /**
   * The date the cache object expires
   */
  expire: Date;
}
