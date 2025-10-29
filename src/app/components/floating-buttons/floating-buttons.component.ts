import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';
import { LgpdService } from '../../services/lgpd.service';

@Component({
  selector: 'app-floating-buttons',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './floating-buttons.component.html',
  styleUrls: ['./floating-buttons.component.css']
})
export class FloatingButtonsComponent implements OnInit {
  showLGPDButton = false;

  constructor(
    private themeService: ThemeService,
    private lgpdService: LgpdService
  ) {}

  ngOnInit() {
    // Observa o estado do consentimento LGPD
    this.lgpdService.aceitouLGPD$.subscribe(aceito => {
      this.showLGPDButton = aceito;
    });
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  revisarLGPD() {
    this.lgpdService.revisarConsentimento();
  }

  get isDark(): boolean {
    return this.themeService.isDark();
  }
}
