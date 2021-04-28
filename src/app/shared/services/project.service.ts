import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpService } from 'src/app/core/services/http.service';
import { environment } from 'src/environments/environment';
import { Project } from '../models/project.model';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  constructor(private httpService: HttpService) {}

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
}
