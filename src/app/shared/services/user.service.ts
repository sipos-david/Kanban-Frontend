import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpService } from 'src/app/core/services/http.service';
import { LoggingService } from 'src/app/core/services/logging.service';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private http: HttpClient,
    private httpService: HttpService,
    private loggingService: LoggingService
  ) {}

  private name = 'UserService';

  public getUsers(): Observable<User[]> {
    return this.httpService.get<User[]>(
      this.name,
      'getUsers()',
      'fetchted all users',
      environment.api.v1.cache.user.all,
      environment.api.v1.url.user.all,
      1
    );
  }

  getRegistration(): Observable<boolean> {
    return this.http
      .get<boolean>(environment.api.v1.url.user.registration)
      .pipe(
        tap((response) => {
          this.loggingService.log('User registartion check: ' + response);
        })
      );
  }

  registerUser(): Observable<User> {
    return this.httpService.post<User>(
      this.name,
      'registerUser()',
      'register user',
      environment.api.v1.url.user.registration,
      { id: '', name: '' }
    );
  }
}
