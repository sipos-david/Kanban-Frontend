import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, Inject, OnInit } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from 'src/app/shared/models/user.model';
import { AddTaskDialogData } from './add-task-dialog-data.model';

@Component({
  selector: 'app-add-task-dialog',
  templateUrl: './add-task-dialog.component.html',
  styleUrls: ['./add-task-dialog.component.css'],
})
export class AddTaskDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<AddTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddTaskDialogData
  ) {}

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  public onNoClick(): void {
    this.dialogRef.close();
  }

  public add(event: MatChipInputEvent): void {
    const input = event.chipInput?.inputElement;
    if (event.value) {
      const value = event.value.trim();
      const user = this.data.users.find((u) => u.name === value);

      // add user
      if (user) {
        this.data.addedUsers.push(user);
      }
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  public remove(user: User): void {
    const index = this.data.addedUsers.indexOf(user);

    if (index >= 0) {
      this.data.addedUsers.splice(index, 1);
    }
  }

  ngOnInit(): void {}
}
