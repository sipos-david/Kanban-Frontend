import { Component, Input, OnInit } from '@angular/core';
import { SettingsService } from 'src/app/core/services/settings.service';
import { Task } from 'src/app/shared/models/task.model';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css'],
})
export class TaskComponent implements OnInit {
  constructor() {}

  @Input() public data: Task | undefined;

  ngOnInit(): void {}
}
