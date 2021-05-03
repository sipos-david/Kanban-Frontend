import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CacheService } from 'src/app/core/services/cache.service';
import { HttpService } from 'src/app/core/services/http.service';
import { environment } from 'src/environments/environment';
import { Project } from '../models/project.model';

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
        'added all project',
        environment.api.v1.url.project,
        project
      )
      .pipe(
        tap(() =>
          this.cacheService.removeItem(environment.api.v1.cache.project.all)
        )
      );
  }
}
