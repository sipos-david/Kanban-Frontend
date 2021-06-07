import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private isDarkMode = true;

  private isSearchEnabled = true;

  public themeChangeEvent = new EventEmitter<boolean>();
  public searchEnabledChangeEvent = new EventEmitter<boolean>();

  public get darkMode(): boolean {
    return this.isDarkMode;
  }

  public set darkMode(isDarkMode: boolean) {
    this.themeChangeEvent.emit(isDarkMode);
  }

  public get searchEnabled(): boolean {
    return this.isSearchEnabled;
  }

  public set searchEnabled(isSearchEnabled: boolean) {
    this.isSearchEnabled = isSearchEnabled;
    this.searchEnabledChangeEvent.emit(isSearchEnabled);
  }
}
