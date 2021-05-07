import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SettingsService } from 'src/app/core/services/settings.service';
import { Column } from 'src/app/shared/models/column.model';
import { Table } from 'src/app/shared/models/table.model';
import { Task } from 'src/app/shared/models/task.model';
import { ColumnService } from 'src/app/shared/services/column.service';
import { TableService } from 'src/app/shared/services/table.service';
import { TaskService } from 'src/app/shared/services/task.service';
import { UserService } from 'src/app/shared/services/user.service';
import { AddTaskDialogData } from '../dialogs/add-task-dialog/add-task-dialog-data.model';
import { AddTaskDialogComponent } from '../dialogs/add-task-dialog/add-task-dialog.component';
import { SimpleAddDialogData } from '../dialogs/simple-add-dialog/simple-add-dialog-data.model';
import { SimpleAddDialogComponent } from '../dialogs/simple-add-dialog/simple-add-dialog.component';
import { SimpleDialogComponent } from '../dialogs/simple-dialog/simple-dialog.component';
import { SimpleDialogData } from '../dialogs/simple-dialog/simple-dialog.model';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tableService: TableService,
    private userService: UserService,
    private columnService: ColumnService,
    private settingsService: SettingsService,
    private taskService: TaskService,
    public dialog: MatDialog
  ) {
    this.settingsService.themeChangeEvent.subscribe((isDarkMode) =>
      this.setDarkMode(isDarkMode)
    );
    this.setDarkMode(this.settingsService.darkMode);
    this.taskRemovedEvent.subscribe(() => {
      this.getTableFromServer();
    });
  }

  public table: Table | undefined;

  public dragPreviewClasses = '';

  public taskRemovedEvent = new EventEmitter<Task>();

  private setDarkMode(isDarkMode: boolean): void {
    if (isDarkMode === true) {
      this.dragPreviewClasses = 'darkMode';
    } else {
      this.dragPreviewClasses = '';
    }
  }

  ngOnInit(): void {
    this.getTable();
  }

  public onEditTableName(): void {
    const data = new SimpleAddDialogData();
    data.title = 'Edit table name';
    data.subtitle = "Please enter the table's new name:";
    data.placeholder = 'New name';
    data.text = this.table?.name;
    const dialogRef = this.dialog.open(SimpleAddDialogComponent, {
      data,
    });

    dialogRef.afterClosed().subscribe((result: SimpleAddDialogData) => {
      if (result && result.text && result.text !== '' && this.table != null) {
        this.tableService
          .changeTableName(this.table, { name: result.text })
          .subscribe(() => this.getTableFromServer());
      }
    });
  }

  public getTable(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id != null) {
      this.tableService
        .getTable(+id)
        .subscribe((table) => this.sortTasks(table));
    }
  }

  public getTableFromServer(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id != null) {
      this.tableService
        .getTableFromServer(+id)
        .subscribe((table) => this.sortTasks(table));
    }
  }

  private sortTasks(table: Table): void {
    table.columns.forEach((c) =>
      c.tasks.sort((t1, t2) => t1.number - t2.number)
    );
    this.table = table;
  }

  public onGoBack(): void {
    this.router.navigate(['projects', this.table?.projectId]);
  }

  public onDeleteTable(): void {
    const data = new SimpleDialogData();
    data.title = 'Delete table';
    data.subtitle =
      'Are you sure you want to delete "' + this.table?.name + '" ?';
    const dialogRef = this.dialog.open(SimpleDialogComponent, {
      data,
    });

    dialogRef.afterClosed().subscribe((result: SimpleDialogData) => {
      if (result && this.table) {
        this.tableService
          .deleteTable(this.table)
          .subscribe(() =>
            this.router.navigate(['projects/', this.table?.projectId])
          );
      }
    });
  }

  public onEditColumn(column: Column) {
    const data = new SimpleAddDialogData();
    data.title = 'Edit column';
    data.subtitle = "Please enter column's new name:";
    data.placeholder = 'New name';
    data.text = column.name;
    const dialogRef = this.dialog.open(SimpleAddDialogComponent, {
      data,
    });

    dialogRef.afterClosed().subscribe((result: SimpleAddDialogData) => {
      if (result && result.text && result.text !== '' && this.table != null) {
        column.name = result.text;
        // TODO: edit column name on server
      }
    });
  }

  public onRemoveColumn(column: Column) {
    const data = new SimpleDialogData();
    data.title = 'Delete column';
    data.subtitle = 'Are you sure you want to delete "' + column?.name + '" ?';
    const dialogRef = this.dialog.open(SimpleDialogComponent, {
      data,
    });

    dialogRef.afterClosed().subscribe((result: SimpleDialogData) => {
      if (result && this.table) {
        this.columnService
          .removeColumn(this.table, column)
          .subscribe(() => this.getTableFromServer());
      }
    });
  }

  public onAddColumn(): void {
    const data = new SimpleAddDialogData();
    data.title = 'Add column';
    data.subtitle = 'Please enter the new name: ';
    data.placeholder = 'New column';
    const dialogRef = this.dialog.open(SimpleAddDialogComponent, {
      data,
    });

    dialogRef.afterClosed().subscribe((result: SimpleAddDialogData) => {
      if (result && result.text && result.text !== '' && this.table != null) {
        this.columnService
          .addColumn(this.table, {
            id: undefined,
            tableId: undefined,
            number: this.table.columns.length,
            name: result.text,
            tasks: [],
          })
          .subscribe(() => this.getTableFromServer());
      }
    });
  }

  public drop(event: CdkDragDrop<Task[]>): void {
    if (
      event.previousContainer === event.container &&
      event.previousIndex === event.currentIndex
    ) {
      return;
    }

    this.table?.columns.forEach((c) => {
      if (c.tasks === event.container.data) {
        event.item.data.number = event.currentIndex;
        this.columnService
          .moveTask(c, event.item.data)
          .subscribe(() => this.getTableFromServer());
      }
    });

    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  public onAddTask(column: Column): void {
    const data = new AddTaskDialogData();
    this.userService.getUsers().subscribe((users) => {
      data.users = users;
      const dialogRef = this.dialog.open(AddTaskDialogComponent, {
        data,
      });

      dialogRef.afterClosed().subscribe((result: AddTaskDialogData) => {
        if (
          result &&
          result.name &&
          result.description !== '' &&
          this.table != null
        ) {
          this.columnService
            .addTask(column, {
              id: undefined,
              columnId: column.id,
              name: result.name,
              number: column.tasks.length,
              description: result.description,
              comments: [],
              users: result.addedUsers,
            })
            .subscribe(() => this.getTableFromServer());
        }
      });
    });
  }
}
