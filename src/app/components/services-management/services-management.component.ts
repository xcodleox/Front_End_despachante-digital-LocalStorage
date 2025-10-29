import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService, Servico } from '../../services/app.service';

@Component({
  selector: 'app-services-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './services-management.component.html',
  styleUrl: './services-management.component.css'
})
export class ServicesManagementComponent implements OnInit {
  servicos: Servico[] = [];
  
  // Novo serviço
  novoServico = {
    nome: '',
    descricao: '',
    valor: 0,
    imagem: '',
    camposExtras: [] as string[]
  };
  
  campoExtraTemp = '';
  imagemPreview: string | null = null;

  constructor(
    private appService: AppService,
    private router: Router
  ) {}

  ngOnInit() {
    this.carregarServicos();
  }

  carregarServicos() {
    this.servicos = this.appService.listarServicos();
  }

  // =================== NOVO SERVIÇO ===================
  
  adicionarCampoExtra() {
    if (this.campoExtraTemp.trim()) {
      this.novoServico.camposExtras.push(this.campoExtraTemp.trim());
      this.campoExtraTemp = '';
    }
  }

  removerCampoExtra(index: number) {
    this.novoServico.camposExtras.splice(index, 1);
  }

  onImagemSelecionada(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        this.novoServico.imagem = reader.result as string;
        this.imagemPreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  salvarNovoServico() {
    // Validar campos obrigatórios
    if (!this.novoServico.nome.trim()) {
      alert('Por favor, preencha o nome do serviço!');
      return;
    }

    if (!this.novoServico.descricao.trim()) {
      alert('Por favor, preencha a descrição do serviço!');
      return;
    }

    if (this.novoServico.valor <= 0) {
      alert('Por favor, insira um valor maior que zero!');
      return;
    }

    this.appService.criarServico(this.novoServico);
    
    // Resetar formulário
    this.novoServico = {
      nome: '',
      descricao: '',
      valor: 0,
      imagem: '',
      camposExtras: []
    };
    this.imagemPreview = null;
    
    this.carregarServicos();
    alert('Serviço cadastrado com sucesso!');
  }

  // =================== EDITAR SERVIÇOS ===================
  
  onImagemServicoSelecionada(event: Event, servico: Servico) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        this.appService.atualizarServico(servico.id, { imagem: reader.result as string });
        this.carregarServicos();
      };
      reader.readAsDataURL(file);
    }
  }

  removerImagemServico(servico: Servico) {
    this.appService.atualizarServico(servico.id, { imagem: undefined });
    this.carregarServicos();
    alert('Imagem removida!');
  }

  atualizarCampoServico(servico: Servico, campo: keyof Servico, valor: any) {
    this.appService.atualizarServico(servico.id, { [campo]: valor });
  }

  removerCampoExtraServico(servico: Servico, index: number) {
    const novosCampos = [...servico.camposExtras];
    novosCampos.splice(index, 1);
    this.appService.atualizarServico(servico.id, { camposExtras: novosCampos });
    this.carregarServicos();
  }

  deletarServico(servico: Servico) {
    if (confirm(`Tem certeza que deseja excluir o serviço "${servico.nome}"?`)) {
      this.appService.deletarServico(servico.id);
      this.carregarServicos();
      alert('Serviço excluído!');
    }
  }

  formatarValor(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  converterParaNumero(valor: string): number {
    const num = parseFloat(valor);
    return isNaN(num) ? 0 : num;
  }

  voltar() {
    this.router.navigate(['/admin']);
  }
}
