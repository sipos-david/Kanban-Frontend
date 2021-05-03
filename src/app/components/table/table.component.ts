import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Table } from 'src/app/shared/models/table.model';
import { TableService } from 'src/app/shared/services/table.service';
import { UserService } from 'src/app/shared/services/user.service';

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

  public onAddColumn(): void {}
}
