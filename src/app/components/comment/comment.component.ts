import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Comment } from 'src/app/shared/models/comment.model';
import { CommentService } from 'src/app/shared/services/comment.service';
import { TaskService } from 'src/app/shared/services/task.service';
import { SimpleAddDialogData } from '../dialogs/simple-add-dialog/simple-add-dialog-data.model';
import { SimpleAddDialogComponent } from '../dialogs/simple-add-dialog/simple-add-dialog.component';
import { SimpleDialogComponent } from '../dialogs/simple-dialog/simple-dialog.component';
import { SimpleDialogData } from '../dialogs/simple-dialog/simple-dialog.model';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css'],
})
export class CommentComponent {
  constructor(
    public dialog: MatDialog,
    private commentService: CommentService,
    private taskService: TaskService
  ) {}

  @Input() public data: Comment | undefined;

  @Input() public dataChangedEvent: EventEmitter<Comment> | undefined;

  public onDeleteComment(): void {
    const data = new SimpleDialogData();
    data.title = 'Delete comment';
    data.subtitle = 'Are you sure you want to remove this comment?';
    const dialogRef = this.dialog.open(SimpleDialogComponent, {
      data,
    });

    dialogRef.afterClosed().subscribe((result: SimpleDialogData) => {
      if (result && this.data && this.data.taskId) {
        this.taskService.getTask(this.data?.taskId).subscribe((task) => {
          if (this.data) {
            this.commentService
              .removeComment(task, this.data)
              .subscribe((comment) => this.dataChangedEvent?.emit(comment));
          }
        });
      }
    });
  }

  public onEditComment(): void {
    const data = new SimpleAddDialogData();
    data.title = 'Edit comment';
    data.subtitle = 'Please edit the comment:';
    data.placeholder = 'New text...';
    data.text = this.data?.text;
    const dialogRef = this.dialog.open(SimpleAddDialogComponent, {
      data,
    });

    dialogRef.afterClosed().subscribe((result: SimpleAddDialogData) => {
      if (result && result.text && result.text !== '' && this.data != null) {
        this.commentService
          .changeComment(this.data, { text: result.text })
          .subscribe((c) => this.dataChangedEvent?.emit(c));
      }
    });
  }
}
