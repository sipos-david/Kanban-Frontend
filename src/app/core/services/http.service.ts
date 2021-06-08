import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { CacheService } from 'src/app/core/services/cache.service';
import { LoggingService } from 'src/app/core/services/logging.service';

/**
 * Service for sending HTTP REST messages. If the response has data, stores it in the cache.
 */
@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(
    private http: HttpClient,
    private loggingService: LoggingService,
    private cacheService: CacheService
  ) {}

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  /**
   *  Fetches the T type object from the given url. If it's avaliable from the cache, and not expired, uses that data.
   *
   * @param serviceName  the name of the service wich called the function
   * @param callerFunctionName the name of the caller function
   * @param logMessage the message to be logged
   * @param key the key in the cache
   * @param url the url to get the data from
   * @param expiryDays the days until the data expires
   * @returns the T type object wrapped in an Observable
   */
  public get<T>(
    serviceName: string,
    callerFunctionName: string,
    logMessage: string,
    key: string,
    url: string,
    expiryDays: number
  ): Observable<T> {
    const cached = this.cacheService.getItem<T>(key);
    if (cached) {
      return cached;
    } else {
      return this.http.get<T>(url, this.httpOptions).pipe(
        tap((response) => {
          this.loggingService.log(serviceName + ': ' + logMessage);
          this.cacheService.setItem<T>(key, response, expiryDays);
        }),
        catchError(this.handleHttpError<T>(serviceName, callerFunctionName))
      );
    }
  }

  /**
   *  Puts the T type object in the given url, then stores the response value in the cache
   *
   * @param serviceName  the name of the service wich called the function
   * @param callerFunctionName the name of the caller function
   * @param logMessage the message to be logged
   * @param key the key in the cache
   * @param url the url to send the data to
   * @param expiryDays the days until the data expires
   * @param object the new edited object
   * @returns the T type object wrapped in an Observable
   */
  put<T>(
    serviceName: string,
    callerFunctionName: string,
    logMessage: string,
    key: string,
    url: string,
    expiryDays: number,
    object: T
  ): Observable<T> {
    return this.http.put<T>(url, object, this.httpOptions).pipe(
      tap((response) => {
        this.loggingService.log(serviceName + ': ' + logMessage);
        this.cacheService.setItem<T>(key, response, expiryDays);
      }),
      catchError(this.handleHttpError<T>(serviceName, callerFunctionName))
    );
  }

  /**
   *  Posts the T type object in the given url
   *
   * @param serviceName  the name of the service wich called the function
   * @param callerFunctionName the name of the caller function
   * @param logMessage the message to be logged
   * @param url the url to send the data to
   * @param object the new object
   * @returns the T type object wrapped in an Observable
   */
  post<T>(
    serviceName: string,
    callerFunctionName: string,
    logMessage: string,
    url: string,
    object: T
  ): Observable<T> {
    return this.http.post<T>(url, object, this.httpOptions).pipe(
      tap((_) => {
        this.loggingService.log(serviceName + ': ' + logMessage);
      }),
      catchError(this.handleHttpError<T>(serviceName, callerFunctionName))
    );
  }

  /**
   *  Deletes the T type object in the given url, then removes the cached object if exists.
   *
   * @param serviceName  the name of the service wich called the function
   * @param callerFunctionName the name of the caller function
   * @param logMessage the message to be logged
   * @param key the key in the cache
   * @param url the url to get the data from
   * @returns the T type object wrapped in an Observable
   */
  public delete<T>(
    serviceName: string,
    callerFunctionName: string,
    logMessage: string,
    key: string,
    url: string
  ): Observable<T> {
    return this.http.delete<T>(url, this.httpOptions).pipe(
      tap((_) => {
        this.loggingService.log(serviceName + ': ' + logMessage);
        this.cacheService.removeItem(key);
      }),
      catchError(this.handleHttpError<T>(serviceName, callerFunctionName))
    );
  }

  /**
   * Patches an object on the server
   *
   * @param serviceName  the name of the service wich called the function
   * @param callerFunctionName the name of the caller function
   * @param logMessage the message to be logged
   * @param url the url to patch
   * @param body the data in the body
   * @returns the answer of the patch as any
   */
  public patch(
    serviceName: string,
    callerFunctionName: string,
    logMessage: string,
    url: string,
    body: any
  ): Observable<any> {
    return this.http.patch(url, body, this.httpOptions).pipe(
      tap((_) => {
        this.loggingService.log(serviceName + ': ' + logMessage);
      }),
      catchError(this.handleHttpError<any>(serviceName, callerFunctionName))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param service - the name of the service where the exception happened
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleHttpError<T>(
    service: string,
    operation = 'operation',
    result?: T
  ): (error: any) => Observable<T> {
    return (error: any): Observable<T> => {
      this.loggingService.error(
        error,
        `${service}: ${operation} failed: ${error.message}`
      );

      this.loggingService.log(
        `${service}: ${operation} failed: ${error.message}`
      );

      const response = error as HttpResponse<T>;

      if (response.status === 404) {
        return new Observable<T>();
      }

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
