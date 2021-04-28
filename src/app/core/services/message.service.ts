import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * Service for delivering messages to the user
 */
@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor(private snackBar: MatSnackBar) {}

  /**
   * The duration the snackbar get's displayed
   */
  durationInSeconds = 3;

  displaySimpleSnackBar(message: string): void {
    this.snackBar.open(message, '', {
      duration: this.durationInSeconds * 1000,
      panelClass: ['simple-snack-bar'],
    });
  }
}
