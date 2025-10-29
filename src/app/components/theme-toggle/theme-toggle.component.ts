import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Moon, Sun } from 'lucide-angular';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.css']
})
export class ThemeToggleComponent {
  readonly icons = {
    Moon,
    Sun
  };

  constructor(public themeService: ThemeService) {}

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  get ariaLabel(): string {
    return this.themeService.isLightTheme() 
      ? 'Ativar tema escuro' 
      : 'Ativar tema claro';
  }
}
