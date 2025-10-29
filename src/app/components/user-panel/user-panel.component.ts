import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService, Solicitacao, Mensagem, Servico } from '../../services/app.service';

@Component({
  selector: 'app-user-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-panel.component.html',
  styleUrls: ['./user-panel.component.css']
})
export class UserPanelComponent implements OnInit {
  solicitacoes: Solicitacao[] = [];
  servicos: Servico[] = [];
  usuarioNome = '';
  usuarioEmail = '';
  
  // Estado do chat
  chatMensagens: { [key: string]: string } = {};
  arquivosSelecionados: { [key: string]: File[] } = {};

  constructor(
    private appService: AppService,
    private router: Router
  ) {}

  ngOnInit() {
    const usuario = this.appService.obterUsuarioAtual();
    if (usuario) {
      this.usuarioNome = usuario.nome;
      this.usuarioEmail = usuario.email;
      this.carregarDados();
    }
  }

  carregarDados() {
    this.solicitacoes = this.appService.listarSolicitacoesUsuario(this.usuarioEmail);
    this.servicos = this.appService.listarServicos();
    
    // Popula o objeto servico em cada solicitação
    this.solicitacoes = this.solicitacoes.map(sol => ({
      ...sol,
      servico: this.servicos.find(s => s.id === sol.servicoId)
    }));
  }

  logout() {
    this.appService.logout();
    this.router.navigate(['/login']);
  }

  getStatusBadgeClass(status: string): string {
    const classes: Record<string, string> = {
      'Pendente': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      'Em Andamento': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'Em andamento': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'Concluído': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      'Finalizado': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      'Cancelado': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      'Pausado': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
    };
    return classes[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
  }

  formatarValor(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  // =================== SISTEMA DE CHAT ===================

  getChat(solicitacao: Solicitacao): Mensagem[] {
    return solicitacao.chat || [];
  }

  selecionarArquivo(event: Event, solicitacao: Solicitacao) {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    
    if (files && files.length > 0) {
      this.arquivosSelecionados[solicitacao.id] = Array.from(files);
      alert(`${files.length} arquivo(s) selecionado(s)`);
    }
  }

  enviarMensagem(solicitacao: Solicitacao) {
    const texto = this.chatMensagens[solicitacao.id];
    
    if (!texto || texto.trim() === '') {
      alert('Digite uma mensagem!');
      return;
    }

    const arquivos = this.arquivosSelecionados[solicitacao.id]?.map(f => f.name) || [];
    
    // Envia mensagem através do AppService
    this.appService.enviarMensagem(solicitacao.id, 'user', texto, arquivos);
    
    // Recarrega dados
    this.carregarDados();

    // Limpa campos
    this.chatMensagens[solicitacao.id] = '';
    this.arquivosSelecionados[solicitacao.id] = [];
    alert('Mensagem enviada!');
  }

  getArquivosSelecionadosCount(solicitacaoId: number): number {
    return this.arquivosSelecionados[solicitacaoId]?.length || 0;
  }
}
