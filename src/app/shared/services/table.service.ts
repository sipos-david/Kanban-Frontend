import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CacheService } from 'src/app/core/services/cache.service';
import { HttpService } from 'src/app/core/services/http.service';
import { environment } from 'src/environments/environment';
import { Project } from '../models/project.model';
import { Table } from '../models/table.model';

@Injectable({
  providedIn: 'root',
})
export class TableService {
  constructor(
    private httpService: HttpService,
    private cacheService: CacheService
  ) {}

  private name = 'TableService';

  public getTable(id: number): Observable<Table> {
    return this.httpService.get<Table>(
      this.name,
      'getTable()',
      'fetchted table with id:' + id,
      environment.api.v1.cache.table.id + id,
      environment.api.v1.url.table + '/' + id,
      1
    );
  }

  public getTableFromServer(id: number): Observable<Table> {
    this.cacheService.removeItem(environment.api.v1.cache.table.id + id);
    return this.getTable(id);
  }

  public addTable(project: Project, table: Table): Observable<Table> {
    return this.httpService
      .post<Table>(
        this.name,
        'addTable()',
        'added table to project: ' + project.id,
        environment.api.v1.url.project + '/' + project.id + '/tables',
        table
      )
      .pipe(
        tap(() =>
          this.cacheService.removeItem(
            environment.api.v1.cache.project.id + project.id
          )
        )
      );
  }

  public deleteTable(table: Table): Observable<Table> {
    return this.httpService
      .delete<Table>(
        this.name,
        'addTable()',
        'delete table with id: ' + table.id,
        environment.api.v1.cache.table.id + table.id,
        environment.api.v1.url.project +
          '/' +
          table.projectId +
          '/tables?table=' +
          table.id
      )
      .pipe(
        tap(() =>
          this.cacheService.removeItem(
            environment.api.v1.cache.project.id + table.projectId
          )
        )
      );
  }
}
