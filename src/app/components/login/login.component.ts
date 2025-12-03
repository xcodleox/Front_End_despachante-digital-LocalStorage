import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService } from '../../services/app.service';
import { NotificationService } from '../../services/notificaçoes.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  senha = '';
  mostrarSenha = false;
  erro = '';
  tipoLogin: 'user' | 'admin' = 'user';
  
  // Recuperação de senha
  mostrarRecuperacao = false;
  emailRecuperacao = '';
  respostaRecuperacao = '';
  senhaRecuperada = '';
  perguntaUsuario = '';

  constructor(
    private appService: AppService,
    private router: Router,
    private notify: NotificationService
  ) {}

  toggleSenha() {
    this.mostrarSenha = !this.mostrarSenha;
  }

  selecionarTipo(tipo: 'user' | 'admin') {
    this.tipoLogin = tipo;
    this.erro = '';
  }

  login(event: Event) {
    event.preventDefault();
    this.erro = '';

    if (!this.email || !this.senha) {
      this.erro = 'Por favor, preencha todos os campos.';
      return;
    }

    if (!this.email.includes('@')) {
      this.erro = 'Por favor, insira um e-mail válido.';
      return;
    }

    if (this.senha.length < 6) {
      this.erro = 'A senha deve ter no mínimo 6 caracteres.';
      return;
    }

    const usuario = this.appService.login(this.email, this.senha);
    
    if (usuario && usuario.tipo === this.tipoLogin) {
      this.email = '';
      this.senha = '';
      this.erro = '';
      
      if (this.tipoLogin === 'admin') {
        this.notify.loginSuccess()
        this.router.navigate(['/admin']);
      } else {
        this.notify.loginSuccess()
        this.router.navigate(['/usuario']);
      }
    } else {
      this.erro = 'E-mail ou senha incorretos, ou tipo de usuário inválido.';
      this.notify.loginError()
    }
  }

  esqueceuSenha() {
    this.mostrarRecuperacao = true;
    this.emailRecuperacao = '';
    this.respostaRecuperacao = '';
    this.senhaRecuperada = '';
    this.perguntaUsuario = '';
    this.erro = '';
  }

  buscarPerguntaSeguranca() {
    if (!this.emailRecuperacao || !this.emailRecuperacao.includes('@')) {
      alert('Por favor, insira um e-mail válido.');
      return;
    }

    const usuarios = this.appService.listarUsuarios();
    const usuario = usuarios.find(u => u.email === this.emailRecuperacao);

    if (usuario && usuario.perguntaSeguranca) {
      this.perguntaUsuario = usuario.perguntaSeguranca;
    } else {
      alert('E-mail não encontrado ou não possui pergunta de segurança configurada.');
      this.perguntaUsuario = '';
    }
  }

  recuperarSenha() {
    if (!this.respostaRecuperacao) {
      alert('Por favor, responda a pergunta de segurança.');
      return;
    }

    const senha = this.appService.recuperarSenha(this.emailRecuperacao, this.respostaRecuperacao);

    if (senha) {
      this.senhaRecuperada = senha;
    } else {
      alert('Resposta incorreta. Tente novamente.');
    }
  }

  fecharRecuperacao() {
    this.mostrarRecuperacao = false;
    this.emailRecuperacao = '';
    this.respostaRecuperacao = '';
    this.senhaRecuperada = '';
    this.perguntaUsuario = '';
  }

  cadastrar() {
    this.router.navigate(['/solicitacoes']);
  }
}
