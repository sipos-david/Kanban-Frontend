import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from 'src/app/shared/services/project.service';
import { Project } from 'src/app/shared/models/project.model';
import { Table } from 'src/app/shared/models/table.model';
import { User } from 'src/app/shared/models/user.model';
import { SimpleDialogComponent } from '../dialogs/simple-dialog/simple-dialog.component';
import { SimpleDialogData } from '../dialogs/simple-dialog/simple-dialog.model';
import { MatDialog } from '@angular/material/dialog';
import { AddUserDialogComponent } from '../dialogs/add-user-dialog/add-user-dialog.component';
import { AddUserDialogData } from '../dialogs/add-user-dialog/add-user-dialog.model';
import { UserService } from 'src/app/shared/services/user.service';
import { SimpleAddDialogData } from '../dialogs/simple-add-dialog/simple-add-dialog-data.model';
import { SimpleAddDialogComponent } from '../dialogs/simple-add-dialog/simple-add-dialog.component';
import { TableService } from 'src/app/shared/services/table.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css'],
})
export class ProjectComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private tableService: TableService,
    private userService: UserService,
    public dialog: MatDialog
  ) {}

  public project: Project | undefined;

  ngOnInit(): void {
    this.getProject();
  }

  public getProject(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id != null) {
      this.projectService
        .getProject(+id)
        .subscribe((project) => (this.project = project));
    }
  }

  public onGoBack(): void {
    this.router.navigate(['dashboard']);
  }

  public onDeleteProject(): void {
    const data = new SimpleDialogData();
    data.title = 'Delete project';
    data.subtitle =
      'Are you sure you want to delete "' + this.project?.name + '" ?';
    const dialogRef = this.dialog.open(SimpleDialogComponent, {
      data,
    });

    dialogRef.afterClosed().subscribe((result: SimpleDialogData) => {
      if (result) {
        console.log('delete project');
        // TODO: project delete
      }
    });
  }

  public onEditProjectName(): void {
    const data = new SimpleAddDialogData();
    data.title = 'Edit project name';
    data.subtitle = 'Please enter the new name: ';
    data.placeholder = 'New name...';
    data.text = this.project?.name;
    const dialogRef = this.dialog.open(SimpleAddDialogComponent, {
      data,
    });

    dialogRef.afterClosed().subscribe((result: SimpleAddDialogData) => {
      if (result && result.text && result.text !== '' && this.project != null) {
        this.project.name = result.text;
        // TODO: edit project name on server
      }
    });
  }

  public onAddTable(): void {
    const data = new SimpleAddDialogData();
    data.title = 'Add table';
    data.subtitle = 'Please enter the new name: ';
    data.placeholder = 'New table';
    const dialogRef = this.dialog.open(SimpleAddDialogComponent, {
      data,
    });

    dialogRef.afterClosed().subscribe((result: SimpleAddDialogData) => {
      if (result && result.text && result.text !== '' && this.project != null) {
        this.tableService
          .addTable(this.project, {
            id: undefined,
            projectId: undefined,
            name: result.text,
            columns: [],
          })
          .subscribe(() => this.getProject());
      }
    });
  }

  public onRemoveUser(user: User): void {
    const data = new SimpleDialogData();
    data.title = 'Delete user';
    data.subtitle =
      'Are you sure you want to remove "' +
      user.name +
      '" from "' +
      this.project?.name +
      '" ?';
    const dialogRef = this.dialog.open(SimpleDialogComponent, {
      data,
    });

    dialogRef.afterClosed().subscribe((result: SimpleDialogData) => {
      if (result && this.project) {
        this.projectService
          .removeUser(this.project, user)
          .subscribe(() => this.getProject());
      }
    });
  }

  public onAddUser(): void {
    const data = new AddUserDialogData();

    this.userService.getUsers().subscribe((users) => {
      data.title = "Add user's to project:";
      users.forEach((u) => {
        if (this.project) {
          const index = this.project?.users.findIndex(
            (user) => user.id === u.id
          );
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
          if (this.project) {
            this.projectService
              .addUsers(this.project, result.addedUsers)
              .subscribe(() => this.getProject());
          }
        }
      });
    });
  }

  public viewTable(table: Table): void {
    this.router.navigate(['tables', table.id]);
  }
}
