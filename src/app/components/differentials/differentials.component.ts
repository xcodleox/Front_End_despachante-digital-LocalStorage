import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-differentials',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './differentials.component.html',
  styleUrls: ['./differentials.component.css']
})
export class DifferentialsComponent {
  differentials = [
    'Atendimento 100% online',
    'Segurança e confidencialidade de dados',
    'Processos rápidos e sem burocracia',
    'Equipe especializada e pronta para te ajudar'
  ];
}
