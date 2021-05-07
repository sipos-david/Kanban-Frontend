import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CacheService } from 'src/app/core/services/cache.service';
import { HttpService } from 'src/app/core/services/http.service';
import { environment } from 'src/environments/environment';
import { Column } from '../models/column.model';
import { NameChange } from '../models/name-change.model';
import { Table } from '../models/table.model';
import { Task } from '../models/task.model';

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

  public removeColumn(table: Table, column: Column): Observable<Column> {
    return this.httpService.delete<Column>(
      this.name,
      'removeColumn()',
      'remvoved column from table: ' + table.id,
      environment.api.v1.cache.table.id + table.id,
      environment.api.v1.url.table +
        '/' +
        table.id +
        '/columns?column=' +
        column.id
    );
  }

  public addTask(column: Column, task: Task): Observable<Task> {
    return this.httpService.post<Task>(
      this.name,
      'addTask()',
      'added task to column: ' + column.id,
      environment.api.v1.url.column + '/' + column.id + '/tasks',
      task
    );
  }

  public removeTask(column: Column, task: Task): Observable<Task> {
    return this.httpService.delete<Task>(
      this.name,
      'removeTask()',
      'removed task from column: ' + task.id,
      environment.api.v1.cache.task.id + task.id,
      environment.api.v1.url.column + '/' + column.id + '/tasks?task=' + task.id
    );
  }

  public moveTask(column: Column, task: Task): Observable<Task> {
    return this.httpService
      .put<Task>(
        this.name,
        'moveTask()',
        'moved task: ' + task.id + ' in column: ' + column.id,
        environment.api.v1.cache.task.id + task.id,
        environment.api.v1.url.column + '/' + column.id + '/tasks',
        1,
        task
      )
      .pipe(
        tap(() =>
          this.cacheService.removeItem(
            environment.api.v1.cache.table.id + column.tableId
          )
        )
      );
  }

  public changeColumnName(
    column: Column,
    name: NameChange
  ): Observable<ArrayBuffer> {
    return this.httpService
      .patch(
        this.name,
        'changeColumnName()',
        'change the name of the column: ' + column.id,
        environment.api.v1.url.column + '/' + column.id,
        JSON.stringify(name)
      )
      .pipe(
        tap(() => {
          this.cacheService.removeItem(
            environment.api.v1.cache.table.id + column.tableId
          );
        })
      );
  }
}
