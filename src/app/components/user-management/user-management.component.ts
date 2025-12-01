import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService } from '../../services/app.service';
import { Usuario } from '../../interfaces/padrão';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  usuarios: Usuario[] = [];
  
  // Dialog states
  mostrarDialogEditar = false;
  mostrarDialogSenha = false;
  mostrarDialogNovo = false;
  
  // Usuário selecionado
  usuarioSelecionado: Usuario | null = null;
  
  // Formulário de edição
  form = {
    nome: '',
    email: '',
    tipo: 'user' as 'admin' | 'user',
    senha: '',
    confirmarSenha: ''
  };
  
  // Formulário de novo usuário
  novoUsuarioForm = {
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    tipo: 'user' as 'admin' | 'user'
  };

  constructor(
    private appService: AppService,
    private router: Router
  ) {}

  ngOnInit() {
    this.carregarUsuarios();
  }

  carregarUsuarios() {
    this.usuarios = this.appService.listarTodosUsuarios();
  }

  contarSolicitacoes(email: string): number {
    return this.appService.listarSolicitacoesUsuario(email).length;
  }

  // =================== EDITAR USUÁRIO ===================
  
  editarUsuario(usuario: Usuario) {
    this.usuarioSelecionado = usuario;
    this.form = {
      nome: usuario.nome,
      email: usuario.email,
      tipo: usuario.tipo,
      senha: '',
      confirmarSenha: ''
    };
    this.mostrarDialogEditar = true;
  }

  salvarEdicao() {
    if (!this.form.nome.trim()) {
      alert('Por favor, preencha o nome do usuário!');
      return;
    }

    if (!this.form.email.trim()) {
      alert('Por favor, preencha o e-mail!');
      return;
    }

    if (!this.form.email.includes('@')) {
      alert('Por favor, insira um e-mail válido!');
      return;
    }

    if (this.usuarioSelecionado) {
      const sucesso = this.appService.atualizarUsuario(this.usuarioSelecionado.id, {
        nome: this.form.nome,
        email: this.form.email,
        tipo: this.form.tipo
      });

      if (sucesso) {
        this.carregarUsuarios();
        this.mostrarDialogEditar = false;
        this.usuarioSelecionado = null;
        alert('Usuário atualizado com sucesso!');
      } else {
        alert('Erro ao atualizar usuário. E-mail pode já estar em uso.');
      }
    }
  }

  // =================== ALTERAR SENHA ===================
  
  alterarSenha(usuario: Usuario) {
    this.usuarioSelecionado = usuario;
    this.form.senha = '';
    this.form.confirmarSenha = '';
    this.mostrarDialogSenha = true;
  }

  salvarSenha() {
    if (!this.form.senha || !this.form.confirmarSenha) {
      alert('Preencha todos os campos!');
      return;
    }

    if (this.form.senha !== this.form.confirmarSenha) {
      alert('As senhas não coincidem!');
      return;
    }

    if (this.form.senha.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres!');
      return;
    }

    if (this.usuarioSelecionado) {
      const nomeUsuario = this.usuarioSelecionado.nome;
      const sucesso = this.appService.alterarSenhaUsuario(this.usuarioSelecionado.id, this.form.senha);
      
      if (sucesso) {
        this.mostrarDialogSenha = false;
        this.usuarioSelecionado = null;
        alert(`Senha do usuário ${nomeUsuario} alterada com sucesso!`);
      } else {
        alert('Erro ao alterar senha!');
      }
    }
  }

  // =================== NOVO USUÁRIO ===================
  
  abrirDialogNovo() {
    this.novoUsuarioForm = {
      nome: '',
      email: '',
      senha: '',
      confirmarSenha: '',
      tipo: 'user'
    };
    this.mostrarDialogNovo = true;
  }

  criarNovoUsuario() {
    const { nome, email, senha, confirmarSenha, tipo } = this.novoUsuarioForm;

    if (!nome.trim()) {
      alert('Por favor, preencha o nome do usuário!');
      return;
    }

    if (!email.trim()) {
      alert('Por favor, preencha o e-mail!');
      return;
    }

    if (!email.includes('@')) {
      alert('Por favor, insira um e-mail válido!');
      return;
    }

    if (!senha) {
      alert('Por favor, preencha a senha!');
      return;
    }

    if (!confirmarSenha) {
      alert('Por favor, confirme a senha!');
      return;
    }

    if (senha !== confirmarSenha) {
      alert('As senhas não coincidem!');
      return;
    }

    if (senha.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres!');
      return;
    }

    const novoUsuario = this.appService.criarUsuario(nome, email, senha, tipo);
    
    if (novoUsuario) {
      this.carregarUsuarios();
      this.mostrarDialogNovo = false;
      alert('Usuário criado com sucesso!');
    } else {
      alert('Erro ao criar usuário. E-mail pode já estar em uso.');
    }
  }

  // =================== DELETAR USUÁRIO ===================
  
  deletarUsuario(usuario: Usuario) {
    if (confirm(`Tem certeza que deseja excluir o usuário ${usuario.nome}?`)) {
      const sucesso = this.appService.deletarUsuario(usuario.id);
      
      if (sucesso) {
        this.carregarUsuarios();
        alert('Usuário excluído com sucesso!');
      } else {
        alert('Não é possível excluir o último administrador!');
      }
    }
  }

  // =================== HELPERS ===================
  
  getTipoBadgeClass(tipo: string): string {
    return tipo === 'admin' 
      ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
      : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
  }

  voltar() {
    this.router.navigate(['/admin']);
  }
}
