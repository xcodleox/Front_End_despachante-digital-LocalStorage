import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService, Solicitacao, Servico, Mensagem } from '../../services/app.service';

// =================== INTERFACES AUXILIARES ===================

interface Arquivo {
  nome: string;
  url: string;
}

@Component({
  selector: 'app-requests-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './requests-management.component.html',
  styleUrls: ['./requests-management.component.css']
})
export class RequestsManagementComponent implements OnInit {
  
  // =================== DADOS ===================
  
  solicitacoes: Solicitacao[] = [];
  servicos: Servico[] = [];

  // =================== ESTADO DO CHAT ===================
  
  chatMensagens: { [key: string]: string } = {};
  arquivosSelecionados: { [key: string]: File[] } = {};

  constructor(
    private appService: AppService,
    private router: Router
  ) {}

  ngOnInit() {
    this.carregarDados();
  }

  carregarDados() {
    // Carrega solicitações e serviços do AppService
    this.solicitacoes = this.appService.listarTodasSolicitacoes();
    this.servicos = this.appService.listarServicos();
    
    // Popula o objeto servico em cada solicitação
    this.solicitacoes = this.solicitacoes.map(sol => ({
      ...sol,
      servico: this.servicos.find(s => s.id === sol.servicoId)
    }));
  }

  // =================== HELPERS ===================

  getNomeServico(servicoId: number): string {
    const servico = this.servicos.find(s => s.id === servicoId);
    return servico?.nome || 'Serviço não encontrado';
  }

  getServicoImagem(servicoId: number): string | undefined {
    const servico = this.servicos.find(s => s.id === servicoId);
    return servico?.imagem;
  }

  formatKey(key: string): string {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }

  getStatusBadgeClass(status: string): string {
    const classes: Record<string, string> = {
      'Finalizado': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      'Em andamento': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'Pausado': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
    };
    return classes[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
  }

  getStatusCircleClass(status: string): string {
    const classes: Record<string, string> = {
      'Finalizado': 'text-green-500',
      'Em andamento': 'text-blue-500',
      'Pausado': 'text-yellow-500'
    };
    return classes[status] || 'text-gray-500';
  }

  // =================== AÇÕES DE STATUS ===================

  atualizarStatus(id: number, novoStatus: string) {
    this.appService.atualizarStatusSolicitacao(id, novoStatus);
    this.carregarDados();
    alert(`Status atualizado para: ${novoStatus}`);
  }

  deletarSolicitacao(id: number) {
    if (confirm('Tem certeza que deseja excluir esta solicitação?')) {
      this.appService.deletarSolicitacao(id);
      this.carregarDados();
      alert('Solicitação excluída!');
    }
  }

  // =================== SISTEMA DE CHAT ===================

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
    this.appService.enviarMensagem(solicitacao.id, 'admin', texto, arquivos);
    
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

  // =================== NAVEGAÇÃO ===================

  voltar() {
    this.router.navigate(['/admin']);
  }

  // =================== MÉTODOS AUXILIARES PARA O TEMPLATE ===================

  getObjectKeys(obj: any): string[] {
    return Object.keys(obj || {});
  }

  getObjectValue(obj: any, key: string): any {
    return obj[key];
  }

  getChat(solicitacao: Solicitacao): Mensagem[] {
    return solicitacao.chat || [];
  }
}
