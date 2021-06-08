import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { LoggingService } from './logging.service';

@Injectable({
  providedIn: 'root',
})
export class HealthService {
  constructor(
    private http: HttpClient,
    private loggingService: LoggingService
  ) {}

  getApiHealth(): Observable<string> {
    return this.http
      .get(environment.server.health, {
        responseType: 'text',
      })
      .pipe(
        tap((response) => {
          this.loggingService.log('Server health check : ' + response);
        })
      );
  }
}
