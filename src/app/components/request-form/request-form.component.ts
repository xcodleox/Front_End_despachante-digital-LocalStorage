import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService, Servico } from '../../services/app.service';

@Component({
  selector: 'app-request-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './request-form.component.html',
  styleUrls: ['./request-form.component.css']
})
export class RequestFormComponent implements OnInit {
  servicos: Servico[] = [];
  servicoSelecionado: Servico | null = null;
  formulario!: FormGroup;
  
  // Estados
  pagamentoGerado = false;
  comprovanteFalso = '';
  arquivos: File[] = [];
  usuarioExistente = false;

  constructor(
    private appService: AppService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.servicos = this.appService.listarServicos();
    this.inicializarFormulario();
  }

  inicializarFormulario() {
    this.formulario = this.fb.group({
      servicoId: ['', Validators.required],
      nome: ['', [Validators.required, Validators.minLength(3)]],
      rg: ['', [Validators.required, this.validarRG]],
      cpf: ['', [Validators.required, this.validarCPF]],
      telefone: ['', [Validators.required, this.validarTelefone]],
      email: ['', [Validators.required, Validators.email]],
      endereco: ['', [Validators.required, Validators.minLength(10)]],
      formaPagamento: ['', Validators.required],
      perguntaSeguranca: [''],
      respostaSeguranca: ['']
    });
  }

  // Validadores customizados
  validarCPF(control: AbstractControl): ValidationErrors | null {
    const cpf = control.value?.replace(/\D/g, '');
    
    if (!cpf) return null;
    
    if (cpf.length !== 11) {
      return { cpfInvalido: true };
    }
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpf)) {
      return { cpfInvalido: true };
    }
    
    // Validação dos dígitos verificadores
    let soma = 0;
    let resto;
    
    for (let i = 1; i <= 9; i++) {
      soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) {
      return { cpfInvalido: true };
    }
    
    soma = 0;
    for (let i = 1; i <= 10; i++) {
      soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) {
      return { cpfInvalido: true };
    }
    
    return null;
  }

  validarRG(control: AbstractControl): ValidationErrors | null {
    const rg = control.value?.replace(/\D/g, '');
    
    if (!rg) return null;
    
    if (rg.length < 7 || rg.length > 10) {
      return { rgInvalido: true };
    }
    
    return null;
  }

  validarTelefone(control: AbstractControl): ValidationErrors | null {
    const telefone = control.value?.replace(/\D/g, '');
    
    if (!telefone) return null;
    
    if (telefone.length < 10 || telefone.length > 11) {
      return { telefoneInvalido: true };
    }
    
    return null;
  }

  selecionarServico() {
    const servicoId = this.formulario.get('servicoId')?.value;
    const servico = this.servicos.find(s => s.id.toString() === servicoId);
    this.servicoSelecionado = servico || null;
    this.pagamentoGerado = false;
    this.comprovanteFalso = '';
    
    // Remover campos extras antigos
    Object.keys(this.formulario.controls).forEach(key => {
      if (key.startsWith('extra_')) {
        this.formulario.removeControl(key);
      }
    });
    
    // Adicionar campos extras do novo serviço
    if (servico && servico.camposExtras.length > 0) {
      servico.camposExtras.forEach(campo => {
        this.formulario.addControl(`extra_${campo}`, this.fb.control('', Validators.required));
      });
    }
  }

  gerarPagamentoFalso() {
    if (!this.servicoSelecionado) {
      alert('Selecione um serviço primeiro!');
      return;
    }

    const codigoTransacao = Math.random().toString(36).substring(2, 15).toUpperCase();
    const dataHora = new Date().toLocaleString('pt-BR');
    this.comprovanteFalso = `
      Comprovante de Pagamento Simulado
      ----------------------------------
      Código: ${codigoTransacao}
      Data: ${dataHora}
      Serviço: ${this.servicoSelecionado.nome}
      Valor: R$ ${this.servicoSelecionado.valor.toFixed(2)}
      Status: APROVADO
      ----------------------------------
      Este é um comprovante simulado para fins de teste.
    `;

    this.pagamentoGerado = true;
    alert('Pagamento simulado gerado com sucesso!');
  }

  onArquivoSelecionado(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.arquivos = Array.from(input.files);
      alert(`${this.arquivos.length} arquivo(s) selecionado(s)`);
    }
  }

  verificarEmail() {
    const email = this.formulario.get('email')?.value;
    if (email) {
      this.usuarioExistente = this.appService.verificarUsuarioExiste(email);
      
      // Atualizar validação da pergunta de segurança baseado no usuário existente
      if (this.usuarioExistente) {
        this.formulario.get('perguntaSeguranca')?.clearValidators();
        this.formulario.get('respostaSeguranca')?.clearValidators();
      } else {
        this.formulario.get('perguntaSeguranca')?.setValidators(Validators.required);
        this.formulario.get('respostaSeguranca')?.setValidators(Validators.required);
      }
      this.formulario.get('perguntaSeguranca')?.updateValueAndValidity();
      this.formulario.get('respostaSeguranca')?.updateValueAndValidity();
    }
  }

  onSubmit(event: Event) {
    event.preventDefault();
    
    // Marcar todos os campos como tocados para exibir erros
    Object.keys(this.formulario.controls).forEach(key => {
      this.formulario.get(key)?.markAsTouched();
    });
    
    // Validar serviço selecionado
    if (!this.servicoSelecionado) {
      alert('Por favor, selecione um serviço!');
      return;
    }

    // Validar formulário
    if (this.formulario.invalid) {
      alert('Por favor, corrija os erros do formulário antes de continuar!');
      return;
    }

    if (!this.pagamentoGerado) {
      alert('Por favor, gere o pagamento simulado primeiro!');
      return;
    }

    const formValues = this.formulario.value;
    
    // Verificar se é novo usuário e se preencheu a pergunta de segurança
    const usuarioJaExiste = this.appService.verificarUsuarioExiste(formValues.email);
    
    if (!usuarioJaExiste) {
      if (!formValues.perguntaSeguranca || !formValues.respostaSeguranca) {
        alert('Por favor, preencha a pergunta e resposta de segurança para criar sua conta!');
        return;
      }
    }

    // Gerar protocolo único
    const protocolo = `DSP${Date.now().toString().slice(-8)}${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
    
    let senhaGerada = '';
    
    // Registrar usuário se não existir
    if (!usuarioJaExiste) {
      const novoUsuario = this.appService.registrarUsuario(
        formValues.nome, 
        formValues.email, 
        'user',
        formValues.perguntaSeguranca,
        formValues.respostaSeguranca
      );
      senhaGerada = novoUsuario.senha;
    }
    
    // Formatar data
    const dataAtual = new Date().toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Coletar campos extras
    const camposExtras: Record<string, string> = {};
    if (this.servicoSelecionado.camposExtras) {
      this.servicoSelecionado.camposExtras.forEach(campo => {
        camposExtras[campo] = formValues[`extra_${campo}`] || '';
      });
    }

    // Salvar solicitação no sistema
    const arquivosNomes = this.arquivos.map(f => f.name);
    const dadosCompletos = {
      nome: formValues.nome,
      rg: formValues.rg,
      cpf: formValues.cpf,
      telefone: formValues.telefone,
      endereco: formValues.endereco,
      formaPagamento: formValues.formaPagamento,
      camposExtras: camposExtras,
      arquivos: arquivosNomes,
      protocolo: protocolo
    };
    
    this.appService.criarSolicitacao(
      formValues.email,
      this.servicoSelecionado.id,
      dadosCompletos,
      arquivosNomes
    );

    // Preparar dados para comprovante
    const receiptData = {
      protocolo,
      data: dataAtual,
      servico: this.servicoSelecionado.nome,
      valor: this.servicoSelecionado.valor,
      solicitante: formValues.nome,
      email: formValues.email,
      telefone: formValues.telefone,
      formaPagamento: formValues.formaPagamento,
      senhaGerada: senhaGerada, // Só terá valor se for novo usuário
      usuarioNovo: !usuarioJaExiste
    };

    // Navegar para o comprovante
    this.router.navigate(['/comprovante'], { state: { data: receiptData } });
  }

  // Métodos auxiliares para verificação de erros
  campoInvalido(campo: string): boolean {
    const control = this.formulario.get(campo);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  obterErro(campo: string): string {
    const control = this.formulario.get(campo);
    if (!control || !control.errors) return '';

    if (control.errors['required']) return 'Este campo é obrigatório';
    if (control.errors['email']) return 'E-mail inválido';
    if (control.errors['minlength']) return `Mínimo de ${control.errors['minlength'].requiredLength} caracteres`;
    if (control.errors['cpfInvalido']) return 'CPF inválido';
    if (control.errors['rgInvalido']) return 'RG deve ter entre 7 e 10 dígitos';
    if (control.errors['telefoneInvalido']) return 'Telefone deve ter 10 ou 11 dígitos';

    return 'Campo inválido';
  }

  // Métodos de formatação para máscaras
  formatarCPF(event: Event) {
    const input = event.target as HTMLInputElement;
    let valor = input.value.replace(/\D/g, '');
    
    if (valor.length <= 11) {
      valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
      valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
      valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    
    this.formulario.patchValue({ cpf: valor });
  }

  formatarTelefone(event: Event) {
    const input = event.target as HTMLInputElement;
    let valor = input.value.replace(/\D/g, '');
    
    if (valor.length <= 11) {
      if (valor.length <= 10) {
        valor = valor.replace(/(\d{2})(\d)/, '($1) $2');
        valor = valor.replace(/(\d{4})(\d)/, '$1-$2');
      } else {
        valor = valor.replace(/(\d{2})(\d)/, '($1) $2');
        valor = valor.replace(/(\d{5})(\d)/, '$1-$2');
      }
    }
    
    this.formulario.patchValue({ telefone: valor });
  }

  formatarRG(event: Event) {
    const input = event.target as HTMLInputElement;
    let valor = input.value.replace(/\D/g, '');
    
    if (valor.length <= 10) {
      // Formata conforme o tamanho: 00.000.000-0 ou 00.000.000-00
      if (valor.length <= 9) {
        valor = valor.replace(/(\d{2})(\d)/, '$1.$2');
        valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
        valor = valor.replace(/(\d{3})(\d{1})$/, '$1-$2');
      } else {
        valor = valor.replace(/(\d{2})(\d)/, '$1.$2');
        valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
        valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
      }
    }
    
    this.formulario.patchValue({ rg: valor });
  }

  formatarValor(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
}
