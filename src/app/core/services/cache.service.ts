import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { isNotExpired } from './cache-expiry.validator';
import { CacheObject } from './cache-object.model';

/**
 * Service for caching the data, uses localstorage
 */
@Injectable({
  providedIn: 'root',
})
export class CacheService {
  /**
   * the storage medium which stores the data
   */
  storage = localStorage;

  /**
   * Store a value with the given key
   *
   * @param key the key for the element
   * @param value the value that will be stored
   * @param expiryDays the days the data is valid in the cache
   * @returns the value to be stored as observable
   */
  public setItem<T>(key: string, value: T, expiryDays: number): Observable<T> {
    this.storage.setItem(
      key,
      JSON.stringify(new CacheObject<T>(value, expiryDays))
    );
    return of<T>(value);
  }

  /**
   *  Get's the given element , if it exists
   *
   * @param key the key to the element
   * @return the element as object
   */
  public getItem<T>(key: string): Observable<T> | undefined {
    const value = this.storage.getItem(key);
    if (value) {
      const val = JSON.parse(value) as CacheObject<T>;
      if (isNotExpired<T>(val)) {
        return of<T>(val.object);
      } else {
        return undefined;
      }
    }
    return undefined;
  }

  /**
   *  Removes the element if it exists
   *
   * @param key the key for the element
   */
  public removeItem(key: string): Observable<void> {
    return of(this.storage.removeItem(key));
  }
}
