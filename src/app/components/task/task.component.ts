import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/core/services/auth.service';
import { Task } from 'src/app/shared/models/task.model';
import { User } from 'src/app/shared/models/user.model';
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
    public dialog: MatDialog
  ) {}

  @Input() public data: Task | undefined;

  ngOnInit(): void {}

  onAddComment(): void {
    // TODO: save comment on server
    const data = new SimpleAddDialogData();
    data.title = 'Add comment';
    data.subtitle = 'Please enter the comment: ';
    data.placeholder = 'Write something here...';
    const dialogRef = this.dialog.open(SimpleAddDialogComponent, {
      data,
    });

    dialogRef.afterClosed().subscribe((result: SimpleAddDialogData) => {
      if (result && result.text && result.text !== '' && this.data != null) {
        if (this.authService.userId && this.authService.userName) {
          this.data.comments.push({
            id: undefined,
            taskId: undefined,
            text: result.text,
            date: undefined,
            editedDate: undefined,
            author: {
              id: this.authService.userId,
              name: this.authService.userName,
            },
          });
        }
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
        this.data.name = result.text;
        // TODO: change task name on server
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
        this.data.description = result.text;
        // TODO: change task description on server
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
      if (result) {
        console.log('delete user');
        // TODO: user delete from task
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
        if (result) {
          result.addedUsers.forEach((u) => this.data?.users.push(u));
          console.log('add users...');
          // TODO: add users to task
        }
      });
    });
  }
}
