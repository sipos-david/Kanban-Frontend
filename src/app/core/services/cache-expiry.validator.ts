import { CacheObject } from './cache-object.model';

/**
 * Check's if the cache entry is valid or not.
 *
 * @param cacheObject the cache entry
 * @returns the validity of the entry
 */
export function isNotExpired<T>(cacheObject: CacheObject<T>): boolean {
  return Date.parse(cacheObject.expire.toString()) - new Date().getTime() >= 0
    ? true
    : false;
}
