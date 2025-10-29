import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Testimonial {
  text: string;
  author: string;
}

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.css']
})
export class TestimonialsComponent {
  testimonials: Testimonial[] = [
    {
      text: 'Excelente atendimento! Consegui transferir meu veículo de forma rápida e sem complicações. Super recomendo!',
      author: 'Maria Silva'
    },
    {
      text: 'Processo muito fácil e transparente. A equipe me auxiliou em todas as etapas do licenciamento.',
      author: 'João Santos'
    },
    {
      text: 'Profissionalismo e agilidade! Resolveram um problema que eu tentava há meses em poucos dias.',
      author: 'Ana Costa'
    }
  ];
}
