import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroCarouselComponent } from '../hero-carousel/hero-carousel.component';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule, HeroCarouselComponent],
  templateUrl: './hero-section.component.html',
  styleUrls: ['./hero-section.component.css']
})
export class HeroSectionComponent {}
