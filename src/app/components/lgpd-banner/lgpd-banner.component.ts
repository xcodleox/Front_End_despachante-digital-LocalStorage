import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LgpdService } from '../../services/lgpd.service';

@Component({
  selector: 'app-lgpd-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lgpd-banner.component.html',
  styleUrls: ['./lgpd-banner.component.css']
})
export class LgpdBannerComponent implements OnInit {
  aceitouLGPD = false;
  fadeOut = false;

  constructor(
    private router: Router,
    private lgpdService: LgpdService
  ) {}

  ngOnInit() {
    // Sincroniza com o serviço
    this.lgpdService.aceitouLGPD$.subscribe(aceito => {
      this.aceitouLGPD = aceito;
    });
  }

  aceitarLGPD() {
    this.fadeOut = true;
    setTimeout(() => {
      this.lgpdService.aceitarLGPD();
    }, 500);
  }

  navigateToPrivacy(event: Event) {
    event.preventDefault();
    this.router.navigate(['/privacidade']);
  }
}
