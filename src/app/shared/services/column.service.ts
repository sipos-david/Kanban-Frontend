import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CacheService } from 'src/app/core/services/cache.service';
import { HttpService } from 'src/app/core/services/http.service';
import { environment } from 'src/environments/environment';
import { Column } from '../models/column.model';
import { Project } from '../models/project.model';
import { Table } from '../models/table.model';

@Injectable({
  providedIn: 'root',
})
export class ColumnService {
  constructor(
    private httpService: HttpService,
    private cacheService: CacheService
  ) {}

  private name = 'ColumnService';

  public getColumn(id: number): Observable<Column> {
    return this.httpService.get<Column>(
      this.name,
      'getColumn()',
      'fetchted column with id:' + id,
      environment.api.v1.cache.column.id + id,
      environment.api.v1.url.column + '/' + id,
      1
    );
  }

  public addColumn(table: Table, column: Column): Observable<Column> {
    return this.httpService
      .post<Column>(
        this.name,
        'addTable()',
        'added column to table: ' + table.id,
        environment.api.v1.url.table + '/' + table.id + '/columns',
        column
      )
      .pipe(
        tap(() =>
          this.cacheService.removeItem(
            environment.api.v1.cache.table.id + table.id
          )
        )
      );
  }
}
