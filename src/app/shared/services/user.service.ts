import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'src/app/core/services/http.service';
import { environment } from 'src/environments/environment';
import { Project } from '../models/project.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private httpService: HttpService) {}

  private name = 'UserService';

  public getUsers(): Observable<Project[]> {
    return this.httpService.get<Project[]>(
      this.name,
      'getUsers()',
      'fetchted all users',
      environment.api.v1.cache.user.all,
      environment.api.v1.url.user,
      1
    );
  }
}
