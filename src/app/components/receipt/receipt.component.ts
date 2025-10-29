import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface ReceiptData {
  protocolo: string;
  data: string;
  servico: string;
  valor: number;
  solicitante: string;
  email: string;
  telefone: string;
  formaPagamento: string;
  senhaGerada?: string;
  usuarioNovo?: boolean;
}

@Component({
  selector: 'app-receipt',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.css']
})
export class ReceiptComponent implements OnInit {
  data: ReceiptData | null = null;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.data = navigation.extras.state['data'];
    }
  }

  ngOnInit() {
    if (!this.data) {
      this.router.navigate(['/']);
    }
  }

  imprimir() {
    window.print();
  }

  voltarParaHome() {
    this.router.navigate(['/']);
  }

  formatarValor(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
}
