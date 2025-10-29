import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  isLightTheme = signal(true);

  constructor() {
    this.loadSavedTheme();
  }

  private loadSavedTheme(): void {
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
      this.isLightTheme.set(false);
      document.documentElement.classList.add('dark');
    } else {
      this.isLightTheme.set(true);
      document.documentElement.classList.remove('dark');
    }
  }

  toggleTheme(): void {
    const newTheme = !this.isLightTheme();
    this.isLightTheme.set(newTheme);

    if (newTheme) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  }

  setTheme(theme: 'light' | 'dark'): void {
    const isLight = theme === 'light';
    this.isLightTheme.set(isLight);

    if (isLight) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  }

  isDark(): boolean {
    return !this.isLightTheme();
  }

  isLight(): boolean {
    return this.isLightTheme();
  }
}
