import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CacheService } from 'src/app/core/services/cache.service';
import { HttpService } from 'src/app/core/services/http.service';
import { environment } from 'src/environments/environment';
import { NameChange } from '../models/name-change.model';
import { Project } from '../models/project.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  constructor(
    private httpService: HttpService,
    private cacheService: CacheService
  ) {}

  private name = 'ProjectService';

  public getProjects(): Observable<Project[]> {
    return this.httpService.get<Project[]>(
      this.name,
      'getProjects()',
      'fetchted all projects',
      environment.api.v1.cache.project.all,
      environment.api.v1.url.project,
      1
    );
  }

  public getProject(id: number): Observable<Project> {
    return this.httpService.get<Project>(
      this.name,
      'getProject()',
      'fetchted project with id:' + id,
      environment.api.v1.cache.project.id + id,
      environment.api.v1.url.project + '/' + id,
      1
    );
  }

  public addProject(project: Project): Observable<Project> {
    return this.httpService
      .post<Project>(
        this.name,
        'AddProject()',
        'added project',
        environment.api.v1.url.project,
        project
      )
      .pipe(
        tap(() =>
          this.cacheService.removeItem(environment.api.v1.cache.project.all)
        )
      );
  }

  public removeProject(project: Project): Observable<Project> {
    return this.httpService
      .delete<Project>(
        this.name,
        'removeProject()',
        'remove project with id:' + project.id,
        environment.api.v1.cache.project.id + project.id,
        environment.api.v1.url.project + '/' + project.id
      )
      .pipe(
        tap(() => {
          this.cacheService.removeItem(environment.api.v1.cache.project.all);
        })
      );
  }

  public addUsers(project: Project, users: User[]): Observable<Project> {
    let addedUsers = '?';
    users.forEach((u) => (addedUsers += 'users=' + u.id + '&'));
    addedUsers = addedUsers.slice(0, -1);
    return this.httpService
      .post<Project>(
        this.name,
        'addUsers()',
        'added users project',
        environment.api.v1.url.project +
          '/' +
          project.id +
          '/users' +
          addedUsers,
        project
      )
      .pipe(
        tap(() =>
          this.cacheService.removeItem(
            environment.api.v1.cache.project.id + project.id
          )
        )
      );
  }

  public removeUser(project: Project, user: User): Observable<Project> {
    return this.httpService.delete<Project>(
      this.name,
      'removeUser()',
      'remove user from project',
      environment.api.v1.cache.project.id + project.id,
      environment.api.v1.url.project +
        '/' +
        project.id +
        '/users?user=' +
        user.id
    );
  }

  public changeProjectName(
    project: Project,
    name: NameChange
  ): Observable<ArrayBuffer> {
    return this.httpService
      .patch(
        this.name,
        'changeProjectName()',
        'change the nome of the project:' + project.id,
        environment.api.v1.url.project + '/' + project.id,
        JSON.stringify(name)
      )
      .pipe(
        tap(() => {
          this.cacheService.removeItem(
            environment.api.v1.cache.project.id + project.id
          );
          this.cacheService.removeItem(environment.api.v1.cache.project.all);
        })
      );
  }
}
