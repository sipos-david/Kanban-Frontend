import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Column } from 'src/app/shared/models/column.model';
import { Table } from 'src/app/shared/models/table.model';
import { Task } from 'src/app/shared/models/task.model';
import { ColumnService } from 'src/app/shared/services/column.service';
import { TableService } from 'src/app/shared/services/table.service';
import { UserService } from 'src/app/shared/services/user.service';
import { AddTaskDialogData } from '../dialogs/add-task-dialog/add-task-dialog-data.model';
import { AddTaskDialogComponent } from '../dialogs/add-task-dialog/add-task-dialog.component';
import { SimpleAddDialogData } from '../dialogs/simple-add-dialog/simple-add-dialog-data.model';
import { SimpleAddDialogComponent } from '../dialogs/simple-add-dialog/simple-add-dialog.component';

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
    public dialog: MatDialog
  ) {}

  public table: Table | undefined;

  ngOnInit(): void {
    this.getTable();
  }

  public getTable(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id != null) {
      this.tableService
        .getTable(+id)
        .subscribe((table) => (this.table = table));
    }
  }

  public onGoBack(): void {
    this.router.navigate(['projects', this.table?.projectId]);
  }

  public onDeleteTable(): void {}

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
          .subscribe(() => this.getTable());
      }
    });
  }

  public drop(event: CdkDragDrop<Task[]>): void {
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

  onAddTask(column: Column) {
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
          // TODO: add task on server
          column.tasks.push({
            id: undefined,
            columnid: column.id,
            name: result.name,
            number: column.tasks.length,
            description: result.description,
            comments: [],
            users: [],
          });
        }
      });
    });
  }
}
