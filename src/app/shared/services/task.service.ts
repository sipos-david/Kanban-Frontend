import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CacheService } from 'src/app/core/services/cache.service';
import { HttpService } from 'src/app/core/services/http.service';
import { environment } from 'src/environments/environment';
import { Task } from '../models/task.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(
    private httpService: HttpService,
    private cacheService: CacheService
  ) {}

  private name = 'TaskService';

  public getTask(id: number): Observable<Task> {
    return this.httpService.get<Task>(
      this.name,
      'getTask()',
      'fetched task with id:' + id,
      environment.api.v1.cache.task.id + id,
      environment.api.v1.url.task + '/' + id,
      1
    );
  }

  public removeTask(task: Task): Observable<Task> {
    return this.httpService.delete<Task>(
      this.name,
      'removeTask()',
      'removed task with id:' + task.id,
      environment.api.v1.cache.task.id + task.id,
      environment.api.v1.url.task + '/' + task.id
    );
  }

  public addUsers(task: Task, users: User[]): Observable<Task> {
    let addedUsers = '?';
    users.forEach((u) => (addedUsers += 'users=' + u.id + '&'));
    addedUsers = addedUsers.slice(0, -1);
    return this.httpService
      .post<Task>(
        this.name,
        'addUsers()',
        'added users project',
        environment.api.v1.url.task + '/' + task.id + '/users' + addedUsers,
        task
      )
      .pipe(
        tap(() =>
          this.cacheService.removeItem(
            environment.api.v1.cache.task.id + task.id
          )
        )
      );
  }

  public removeUser(task: Task, user: User): Observable<Task> {
    return this.httpService.delete<Task>(
      this.name,
      'removeUser()',
      'remove user from project',
      environment.api.v1.cache.task.id + task.id,
      environment.api.v1.url.task + '/' + task.id + '/users?user=' + user.id
    );
  }
}
