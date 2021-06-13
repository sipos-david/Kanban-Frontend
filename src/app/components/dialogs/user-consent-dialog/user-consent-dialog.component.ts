import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserConsentData } from './user-consent.model';

@Component({
  selector: 'app-user-consent-dialog',
  templateUrl: './user-consent-dialog.component.html',
  styleUrls: ['./user-consent-dialog.component.css'],
})
export class UserConsentDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<UserConsentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserConsentData
  ) {}

  public onNoClick(): void {
    this.dialogRef.close();
  }
}
