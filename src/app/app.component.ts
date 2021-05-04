import { Component } from '@angular/core';
import { SettingsService } from './core/services/settings.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(settingsService: SettingsService) {
    settingsService.themeChangeEvent.subscribe(
      (darkMode) => (this.isDarkMode = darkMode)
    );
    this.isDarkMode = settingsService.darkMode;
  }
  title = 'kanban-board';

  public isDarkMode = false;
}
