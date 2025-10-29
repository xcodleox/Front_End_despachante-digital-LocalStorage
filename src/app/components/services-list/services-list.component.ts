import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppService, Servico } from '../../services/app.service';

@Component({
  selector: 'app-services-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './services-list.component.html',
  styleUrls: ['./services-list.component.css']
})
export class ServicesListComponent implements OnInit {
  servicos: Servico[] = [];

  constructor(private appService: AppService) {}

  ngOnInit() {
    this.servicos = this.appService.listarServicos();
  }

  formatarValor(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
}
