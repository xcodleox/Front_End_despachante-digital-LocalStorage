import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Telefone {
  tipo: string;
  numero: string;
}

interface Email {
  tipo: string;
  email: string;
}

interface Endereco {
  loja: string;
  endereco: string;
}

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent {
  telefones: Telefone[] = [
    { tipo: 'Principal', numero: '(11) 3456-7890' },
    { tipo: 'WhatsApp', numero: '(11) 98765-4321' },
    { tipo: 'Fixo', numero: '(11) 2345-6789' }
  ];

  emails: Email[] = [
    { tipo: 'Atendimento', email: 'atendimento@despachante.com' },
    { tipo: 'Vendas', email: 'vendas@despachante.com' },
    { tipo: 'Suporte', email: 'suporte@despachante.com' }
  ];

  enderecos: Endereco[] = [
    {
      loja: 'Loja Centro',
      endereco: 'Rua das Flores, 123 - Centro, São Paulo - SP, CEP 01234-567'
    },
    {
      loja: 'Loja Zona Norte',
      endereco: 'Av. dos Estados, 456 - Santana, São Paulo - SP, CEP 02345-678'
    },
    {
      loja: 'Loja Zona Sul',
      endereco: 'Rua do Comércio, 789 - Vila Mariana, São Paulo - SP, CEP 04567-890'
    }
  ];

  formatPhoneNumber(numero: string): string {
    return numero.replace(/\D/g, '');
  }
}
