import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SimpleAddDialogData } from './simple-add-dialog-data.model';

@Component({
  selector: 'app-simple-add-dialog',
  templateUrl: './simple-add-dialog.component.html',
  styleUrls: ['./simple-add-dialog.component.css'],
})
export class SimpleAddDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<SimpleAddDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SimpleAddDialogData
  ) {}

  public onNoClick(): void {
    this.dialogRef.close();
  }
}
