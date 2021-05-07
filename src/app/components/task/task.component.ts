import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/core/services/auth.service';
import { Comment } from 'src/app/shared/models/comment.model';
import { Task } from 'src/app/shared/models/task.model';
import { User } from 'src/app/shared/models/user.model';
import { CommentService } from 'src/app/shared/services/comment.service';
import { TaskService } from 'src/app/shared/services/task.service';
import { UserService } from 'src/app/shared/services/user.service';
import { AddUserDialogComponent } from '../dialogs/add-user-dialog/add-user-dialog.component';
import { AddUserDialogData } from '../dialogs/add-user-dialog/add-user-dialog.model';
import { SimpleAddDialogData } from '../dialogs/simple-add-dialog/simple-add-dialog-data.model';
import { SimpleAddDialogComponent } from '../dialogs/simple-add-dialog/simple-add-dialog.component';
import { SimpleDialogComponent } from '../dialogs/simple-dialog/simple-dialog.component';
import { SimpleDialogData } from '../dialogs/simple-dialog/simple-dialog.model';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css'],
})
export class TaskComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private taskService: TaskService,
    private commentService: CommentService,
    public dialog: MatDialog
  ) {
    this.commentsChangedEvent.subscribe((comment: Comment) => {
      if (this.data) {
        const index = this.data.comments.findIndex((c) => c.id === comment.id);
        if (index > -1) {
          this.data.comments.splice(index, 1);
        }
      }
    });
  }

  @Input() public data: Task | undefined;

  @Input() public dataChangedEvent: EventEmitter<Task> | undefined;

  public commentsChangedEvent = new EventEmitter<Comment>();

  public isTaskExistsOnServer = false;

  ngOnInit(): void {
    if (this.data && this.data.id) {
      this.isTaskExistsOnServer = true;
    }
  }

  onAddComment(): void {
    const data = new SimpleAddDialogData();
    data.title = 'Add comment';
    data.subtitle = 'Please enter the comment: ';
    data.placeholder = 'Write something here...';
    const dialogRef = this.dialog.open(SimpleAddDialogComponent, {
      data,
    });

    dialogRef.afterClosed().subscribe((result: SimpleAddDialogData) => {
      if (
        result &&
        result.text &&
        result.text !== '' &&
        this.data != null &&
        this.authService.userId &&
        this.authService.userName
      ) {
        this.commentService
          .addComment(this.data, {
            id: undefined,
            taskId: undefined,
            text: result.text,
            date: undefined,
            editedDate: undefined,
            author: {
              id: this.authService.userId,
              name: this.authService.userName,
            },
          })
          .subscribe((c) => this.data?.comments.push(c));
      }
    });
  }

  public onEditName(): void {
    const data = new SimpleAddDialogData();
    data.title = 'Change name';
    data.subtitle = 'Please enter the new name of the task:';
    data.placeholder = 'Write something here...';
    data.text = this.data?.name;
    const dialogRef = this.dialog.open(SimpleAddDialogComponent, {
      data,
    });

    dialogRef.afterClosed().subscribe((result: SimpleAddDialogData) => {
      if (result && result.text && result.text !== '' && this.data != null) {
        this.taskService
          .changeTask(this.data, {
            name: result.text,
          })
          .subscribe((t) => {
            this.updateTask(t);
          });
      }
    });
  }

  public onEditDescription() {
    const data = new SimpleAddDialogData();
    data.title = 'Change desciption';
    data.subtitle = 'Please enter the new desciption:';
    data.placeholder = 'Write something here...';
    data.text = this.data?.description;
    const dialogRef = this.dialog.open(SimpleAddDialogComponent, {
      data,
    });

    dialogRef.afterClosed().subscribe((result: SimpleAddDialogData) => {
      if (result && result.text && result.text !== '' && this.data != null) {
        this.taskService
          .changeTask(this.data, {
            description: result.text,
          })
          .subscribe((t) => {
            this.updateTask(t);
          });
      }
    });
  }

  public onRemoveUser(user: User) {
    const data = new SimpleDialogData();
    data.title = 'Delete user';
    data.subtitle =
      'Are you sure you want to remove "' + user?.name + '" from this task?';
    const dialogRef = this.dialog.open(SimpleDialogComponent, {
      data,
    });

    dialogRef.afterClosed().subscribe((result: SimpleDialogData) => {
      if (result && this.data) {
        this.taskService
          .removeUser(this.data, user)
          .subscribe((t) => this.updateTask(t));
      }
    });
  }

  public onAddUser(): void {
    const data = new AddUserDialogData();
    this.userService.getUsers().subscribe((users) => {
      data.title = "Add user's to task:";
      users.forEach((u) => {
        if (this.data) {
          const index = this.data?.users.findIndex((user) => user.id === u.id);
          if (index < 0) {
            data.users.push(u);
          }
        }
      });
      const dialogRef = this.dialog.open(AddUserDialogComponent, {
        data,
      });

      dialogRef.afterClosed().subscribe((result: AddUserDialogData) => {
        if (result && this.data) {
          this.taskService
            .addUsers(this.data, result.addedUsers)
            .subscribe((t) => this.updateTask(t));
        }
      });
    });
  }

  private updateTask(task: Task): void {
    if (this.data) {
      this.dataChangedEvent?.emit(task);
      this.data.id = task.id;
      this.data.name = task.name;
      this.data.columnId = task.columnId;
      this.data.comments = task.comments;
      this.data.description = task.description;
      this.data.number = task.number;
      this.data.users = task.users;
      if (this.data.id) {
        this.isTaskExistsOnServer = true;
      }
    }
  }

  public onDeleteTask(): void {
    const data = new SimpleDialogData();
    data.title = 'Delete task';
    data.subtitle = 'Are you sure you want to delete this  task?';
    const dialogRef = this.dialog.open(SimpleDialogComponent, {
      data,
    });

    dialogRef.afterClosed().subscribe((result: SimpleDialogData) => {
      if (result && this.data) {
        this.taskService.removeTask(this.data).subscribe((t) => {
          if (this.dataChangedEvent && this.data?.id) {
            this.dataChangedEvent.emit(t);
          }
        });
      }
    });
  }
}
