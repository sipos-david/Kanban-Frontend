import { Injectable } from '@angular/core';
import { MessageService } from './message.service';

/**
 * Service for logging the events in the application
 */
@Injectable({
  providedIn: 'root',
})
export class LoggingService {
  constructor(private messageService: MessageService) {}

  public log(message: string): void {
    this.messageService.displaySimpleSnackBar(message);
  }

  public error(error: any, message: string): void {
    this.messageService.displaySimpleSnackBar(message);
    console.error(error);
  }
}
