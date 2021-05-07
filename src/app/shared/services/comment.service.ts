import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CacheService } from 'src/app/core/services/cache.service';
import { HttpService } from 'src/app/core/services/http.service';
import { environment } from 'src/environments/environment';
import { CommentChange } from '../models/comment-change.model';
import { Comment } from '../models/comment.model';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  constructor(
    private httpService: HttpService,
    private cacheService: CacheService
  ) {}

  private name = 'CommentService';

  public getComment(id: number): Observable<Comment> {
    return this.httpService.get<Comment>(
      this.name,
      'getComment()',
      'fetched comment with id:' + id,
      environment.api.v1.cache.comment.id + id,
      environment.api.v1.url.comment + '/' + id,
      1
    );
  }

  public removeComment(task: Task, comment: Comment): Observable<Comment> {
    return this.httpService.delete<Comment>(
      this.name,
      'removeComment()',
      'removed comment with id:' + task.id,
      environment.api.v1.cache.comment.id + comment.id,
      environment.api.v1.url.task +
        '/' +
        task.id +
        '/comments?comment=' +
        comment.id
    );
  }

  public addComment(task: Task, comment: Comment): Observable<Comment> {
    return this.httpService
      .post<Comment>(
        this.name,
        'removeTask()',
        'removed task with id:' + task.id,
        environment.api.v1.url.task + '/' + task.id + '/comments',
        comment
      )
      .pipe(
        tap((c) =>
          this.cacheService.setItem<Comment>(
            environment.api.v1.cache.comment.id + c.id,
            c,
            1
          )
        )
      );
  }

  public changeComment(
    comment: Comment,
    change: CommentChange
  ): Observable<Comment> {
    return this.httpService
      .patch(
        this.name,
        'changeComment()',
        'changed coment with id:' + comment.id,
        environment.api.v1.url.comment + '/' + comment.id,
        change
      )
      .pipe(
        tap((c) =>
          this.cacheService.removeItem(
            environment.api.v1.cache.comment.id + c.id
          )
        )
      );
  }
}
