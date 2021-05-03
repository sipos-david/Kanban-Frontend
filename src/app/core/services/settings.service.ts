import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  constructor() {}

  private isDarkMode = true;

  public themeChangeEvent = new EventEmitter<boolean>();

  public get darkMode(): boolean {
    return this.isDarkMode;
  }

  public set darkMode(isDarkMode: boolean) {
    this.themeChangeEvent.emit(isDarkMode);
  }
}
