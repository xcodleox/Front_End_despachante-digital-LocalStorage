import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

// =================== INTERFACES ===================
export interface Usuario {
  id: number;
  nome: string;
  email: string;
  senha: string;
  tipo: 'admin' | 'user';
  perguntaSeguranca?: string;
  respostaSeguranca?: string;
}

export interface Servico {
  id: number;
  nome: string;
  descricao: string;
  valor: number;
  camposExtras: string[];
  imagem?: string;
}

export interface Mensagem {
  id: number;
  remetente: 'user' | 'admin';
  texto: string;
  data: string;
  arquivos?: string[];
}

export interface Solicitacao {
  id: number;
  usuarioEmail: string;
  servicoId: number;
  servico?: Servico; // Para uso nos componentes (populado dinamicamente)
  protocolo?: string; // Protocolo de atendimento
  dados: any;
  status: 'Pendente' | 'Em Andamento' | 'Concluído' | 'Cancelado' | 'Em andamento' | 'Pausado' | 'Finalizado';
  arquivos?: string[];
  data: string;
  chat?: Mensagem[];
  observacao?: string; // Observação do admin
}

// =================== SERVICE ===================
@Injectable({ providedIn: 'root' })
export class AppService {
  private usuarioSubject = new BehaviorSubject<Usuario | null>(this.usuarioLogado());
  usuario$ = this.usuarioSubject.asObservable();

  constructor(private router: Router) {
    this.criarAdminPadrao();
    this.criarServicosPadrao();
    
    // Debug: Listar usuários criados
    console.log('=== USUÁRIOS CADASTRADOS ===');
    const usuarios = this.listarUsuarios();
    usuarios.forEach(u => {
      console.log(`Nome: ${u.nome}`);
      console.log(`Email: ${u.email}`);
      console.log(`Senha: ${u.senha}`);
      console.log(`Tipo: ${u.tipo}`);
      console.log('---');
    });
    console.log('========================');
  }

  // ============================== CHAT ===================
  enviarMensagem(solicitacaoId: number, remetente: 'user' | 'admin', texto: string, arquivos: string[] = []) {
    const solicitacoes = this.listarSolicitacoes();
    const index = solicitacoes.findIndex(s => s.id === solicitacaoId);
    if (index === -1) return;

    if (!solicitacoes[index].chat) solicitacoes[index].chat = [];

    solicitacoes[index].chat!.push({
      id: Date.now(),
      remetente,
      texto,
      data: new Date().toLocaleString('pt-BR'),
      arquivos
    });

    this.salvarSolicitacoes(solicitacoes);
  }

  obterChat(solicitacaoId: number): Mensagem[] {
    const solicitacao = this.listarSolicitacoes().find(s => s.id === solicitacaoId);
    return solicitacao?.chat || [];
  }

  // ====================== ALTERAR SENHA ====================
  alterarSenha(usuarioEmail: string, senhaAtual: string, novaSenha: string): boolean {
    const usuarios = this.listarUsuarios();
    const index = usuarios.findIndex(u => u.email === usuarioEmail);

    if (index !== -1 && usuarios[index].senha === senhaAtual) {
      usuarios[index].senha = novaSenha;
      this.salvarUsuarios(usuarios);

      const usuarioLogado = this.usuarioLogado();
      if (usuarioLogado && usuarioLogado.email === usuarioEmail) {
        usuarioLogado.senha = novaSenha;
        localStorage.setItem('usuarioLogado', JSON.stringify(usuarioLogado));
        this.usuarioSubject.next(usuarioLogado);
      }

      return true;
    }

    return false;
  }

  // =================== SERVIÇOS PADRÃO ===================
  private criarServicosPadrao() {
    const servicosExistentes = this.listarServicos();
    if (servicosExistentes.length === 0) {
      const servicosPadrao: Servico[] = [
        {
          id: 1,
          nome: 'Transferência de Veículos',
          descricao: 'Realizamos todo o processo de transferência de propriedade de forma digital, rápida e segura. Inclui mudança de titularidade e atualização do CRLV.',
          valor: 350.0,
          camposExtras: ['Placa do veículo', 'Renavam', 'CPF do novo proprietário'],
          imagem: 'https://images.unsplash.com/photo-1644058986421-237d141a9a66?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZWhpY2xlJTIwdHJhbnNmZXIlMjBkb2N1bWVudHN8ZW58MXx8fHwxNzYxNjcyMzM1fDA&ixlib=rb-4.1.0&q=80&w=1080'
        },
        {
          id: 2,
          nome: 'Licenciamento Anual (CRLV)',
          descricao: 'Renovação do licenciamento anual do veículo com emissão do Certificado de Registro e Licenciamento de Veículo atualizado.',
          valor: 150.0,
          camposExtras: ['Placa do veículo', 'Renavam', 'Ano de exercício'],
          imagem: 'https://images.unsplash.com/photo-1695285161214-404148e1d408?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBsaWNlbnNlJTIwcmVnaXN0cmF0aW9ufGVufDF8fHx8MTc2MTY3MjMzNXww&ixlib=rb-4.1.0&q=80&w=1080'
        },
        {
          id: 3,
          nome: 'Regularização de IPVA Atrasado',
          descricao: 'Quitação e regularização de débitos de IPVA atrasado, incluindo cálculo de multas e juros.',
          valor: 200.0,
          camposExtras: ['Placa do veículo', 'Ano do débito'],
          imagem: 'https://images.unsplash.com/photo-1565453004733-4759d7c8f712?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N1bWVudCUyMHZlcmlmaWNhdGlvbiUyMG9mZmljZXxlbnwxfHx8fDE3NjE2NzIzMzZ8MA&ixlib=rb-4.1.0&q=80&w=1080'
        },
        {
          id: 4,
          nome: 'Segunda Via de Documentos',
          descricao: 'Emissão de segunda via do CRV (Certificado de Registro de Veículo) e CRLV (Licenciamento) em caso de perda, roubo ou dano.',
          valor: 180.0,
          camposExtras: ['Placa do veículo', 'Tipo de documento'],
          imagem: 'https://images.unsplash.com/photo-1644058986421-237d141a9a66?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZWhpY2xlJTIwdHJhbnNmZXIlMjBkb2N1bWVudHN8ZW58MXx8fHwxNzYxNjcyMzM1fDA&ixlib=rb-4.1.0&q=80&w=1080'
        },
        {
          id: 5,
          nome: 'Baixa de Veículo',
          descricao: 'Processo de baixa definitiva do veículo junto ao Detran, necessário para veículos que serão sucateados ou exportados.',
          valor: 250.0,
          camposExtras: ['Placa do veículo', 'Motivo da baixa'],
          imagem: 'https://images.unsplash.com/photo-1695285161214-404148e1d408?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBsaWNlbnNlJTIwcmVnaXN0cmF0aW9ufGVufDF8fHx8MTc2MTY3MjMzNXww&ixlib=rb-4.1.0&q=80&w=1080'
        },
        {
          id: 6,
          nome: 'Mudança de Categoria',
          descricao: 'Alteração de categoria do veículo (particular para aluguel, táxi, etc.) com toda a documentação necessária.',
          valor: 300.0,
          camposExtras: ['Placa do veículo', 'Categoria atual', 'Nova categoria'],
          imagem: 'https://images.unsplash.com/photo-1565453004733-4759d7c8f712?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N1bWVudCUyMHZlcmlmaWNhdGlvbiUyMG9mZmljZXxlbnwxfHx8fDE3NjE2NzIzMzZ8MA&ixlib=rb-4.1.0&q=80&w=1080'
        }
      ];

      this.salvarServicos(servicosPadrao);
      console.log('Serviços padrão criados!');
    }
  }

  // =================== ADMIN E USUÁRIO PADRÃO ===================
  private criarAdminPadrao() {
    const usuarios = this.listarUsuarios();
    const adminExiste = usuarios.some(u => u.tipo === 'admin');
    const userExiste = usuarios.some(u => u.email === 'user@user.com');

    if (!adminExiste) {
      const admin: Usuario = {
        id: Date.now(),
        nome: 'Administrador',
        email: 'admin@admin.com',
        senha: 'admin123',
        tipo: 'admin'
      };
      usuarios.push(admin);
      console.log('Admin padrão criado: admin@admin.com / admin123');
    }

    if (!userExiste) {
      const user: Usuario = {
        id: Date.now() + 1,
        nome: 'Usuário Teste',
        email: 'user@user.com',
        senha: 'user123',
        tipo: 'user',
        perguntaSeguranca: 'Qual o nome do seu primeiro animal de estimação?',
        respostaSeguranca: 'rex'
      };
      usuarios.push(user);
      console.log('Usuário padrão criado: user@user.com / user123');
      console.log('Pergunta de segurança: Qual o nome do seu primeiro animal de estimação?');
      console.log('Resposta: rex');
    }

    if (!adminExiste || !userExiste) {
      this.salvarUsuarios(usuarios);
    }
  }

  // =================== USUÁRIOS ===================
  listarUsuarios(): Usuario[] {
    return JSON.parse(localStorage.getItem('usuarios') || '[]');
  }

  salvarUsuarios(usuarios: Usuario[]) {
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
  }

  registrarUsuario(nome: string, email: string, tipo: 'admin' | 'user' = 'user', perguntaSeguranca?: string, respostaSeguranca?: string): Usuario {
    const usuarios = this.listarUsuarios();

    const usuarioExistente = usuarios.find(u => u.email === email);
    if (usuarioExistente) {
      return usuarioExistente;
    }

    const novoUsuario: Usuario = {
      id: Date.now(),
      nome,
      email,
      senha: Math.random().toString(36).substring(2, 8),
      tipo,
      perguntaSeguranca,
      respostaSeguranca
    };

    usuarios.push(novoUsuario);
    this.salvarUsuarios(usuarios);

    return novoUsuario;
  }

  login(email: string, senha: string): Usuario | null {
    console.log('=== TENTATIVA DE LOGIN ===');
    console.log('Email digitado:', email);
    console.log('Senha digitada:', senha);
    
    const usuarios = this.listarUsuarios();
    console.log('Total de usuários:', usuarios.length);
    
    const usuario = usuarios.find(u => u.email === email && u.senha === senha);
    
    if (usuario) {
      console.log('✅ Login bem-sucedido!', usuario);
      localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
      this.usuarioSubject.next(usuario);
      return usuario;
    }
    
    console.log('❌ Login falhou - Usuário não encontrado');
    console.log('Usuários disponíveis:');
    usuarios.forEach(u => console.log(`  - ${u.email} (${u.tipo})`));
    
    return null;
  }

  usuarioLogado(): Usuario | null {
    return JSON.parse(localStorage.getItem('usuarioLogado') || 'null');
  }

  logout() {
    localStorage.removeItem('usuarioLogado');
    this.usuarioSubject.next(null);
    this.router.navigate(['/']);
  }

  // Recuperar senha usando pergunta de segurança
  recuperarSenha(email: string, respostaSeguranca: string): string | null {
    const usuarios = this.listarUsuarios();
    const usuario = usuarios.find(u => 
      u.email === email && 
      u.respostaSeguranca?.toLowerCase() === respostaSeguranca.toLowerCase()
    );
    
    if (usuario) {
      return usuario.senha;
    }
    
    return null;
  }

  // Verificar se usuário existe
  verificarUsuarioExiste(email: string): boolean {
    const usuarios = this.listarUsuarios();
    return usuarios.some(u => u.email === email);
  }

  // =================== SERVIÇOS ===================
  listarServicos(): Servico[] {
    return JSON.parse(localStorage.getItem('servicos') || '[]');
  }

  salvarServicos(servicos: Servico[]) {
    localStorage.setItem('servicos', JSON.stringify(servicos));
  }

  buscarServicoPorId(id: number): Servico | undefined {
    return this.listarServicos().find(s => s.id === id);
  }

  // =================== SOLICITAÇÕES ===================
  listarSolicitacoes(): Solicitacao[] {
    return JSON.parse(localStorage.getItem('solicitacoes') || '[]');
  }

  salvarSolicitacoes(solicitacoes: Solicitacao[]) {
    localStorage.setItem('solicitacoes', JSON.stringify(solicitacoes));
  }

  criarSolicitacao(usuarioEmail: string, servicoId: number, dados: any, arquivos: string[] = []) {
    const solicitacoes = this.listarSolicitacoes();
    const nova: Solicitacao = {
      id: Date.now(),
      usuarioEmail,
      servicoId,
      dados,
      status: 'Pendente',
      data: new Date().toLocaleString('pt-BR'),
      arquivos,
      chat: [],
      protocolo: dados.protocolo || `DSP${Date.now().toString().slice(-8)}`
    };
    solicitacoes.push(nova);
    this.salvarSolicitacoes(solicitacoes);
  }

  atualizarStatus(id: number, novoStatus: 'Em andamento' | 'Pausado' | 'Finalizado') {
    const solicitacoes = this.listarSolicitacoes();
    const index = solicitacoes.findIndex(s => s.id === id);
    if (index !== -1) {
      solicitacoes[index].status = novoStatus;
      this.salvarSolicitacoes(solicitacoes);
    }
  }

  deletarSolicitacao(id: number) {
    const solicitacoes = this.listarSolicitacoes().filter(s => s.id !== id);
    this.salvarSolicitacoes(solicitacoes);
  }

  listarSolicitacoesPorEmail(email: string): Solicitacao[] {
    return this.listarSolicitacoes().filter(s => s.usuarioEmail === email);
  }

  buscarSolicitacaoPorId(id: number): Solicitacao | undefined {
    return this.listarSolicitacoes().find(s => s.id === id);
  }

  obterOuRegistrarUsuario(nome: string, email: string, tipo: 'admin' | 'user' = 'user'): { usuario: Usuario, novo: boolean } {
    const usuarios = this.listarUsuarios();
    const usuarioExistente = usuarios.find(u => u.email === email);

    if (usuarioExistente) {
      return { usuario: usuarioExistente, novo: false };
    }

    const novoUsuario: Usuario = {
      id: Date.now(),
      nome,
      email,
      senha: Math.random().toString(36).substring(2, 8),
      tipo
    };

    usuarios.push(novoUsuario);
    this.salvarUsuarios(usuarios);

    return { usuario: novoUsuario, novo: true };
  }

  // =================== MÉTODOS ADICIONAIS ===================
  
  // Obter usuário atual logado
  obterUsuarioAtual(): Usuario | null {
    return this.usuarioLogado();
  }

  // Listar todas as solicitações (para admin)
  listarTodasSolicitacoes(): Solicitacao[] {
    const solicitacoes = this.listarSolicitacoes();
    const servicos = this.listarServicos();
    
    // Adicionar o objeto servico completo em cada solicitação
    return solicitacoes.map(sol => ({
      ...sol,
      servico: servicos.find(s => s.id === sol.servicoId)
    }));
  }

  // Listar solicitações de um usuário específico
  listarSolicitacoesUsuario(email: string): Solicitacao[] {
    const solicitacoes = this.listarSolicitacoesPorEmail(email);
    const servicos = this.listarServicos();
    
    // Adicionar o objeto servico completo em cada solicitação
    return solicitacoes.map(sol => ({
      ...sol,
      servico: servicos.find(s => s.id === sol.servicoId)
    }));
  }

  // Listar todos os usuários (para admin)
  listarTodosUsuarios(): Usuario[] {
    return this.listarUsuarios();
  }

  // Atualizar status de uma solicitação
  atualizarStatusSolicitacao(id: number, novoStatus: string) {
    const solicitacoes = this.listarSolicitacoes();
    const index = solicitacoes.findIndex(s => s.id === id);
    if (index !== -1) {
      solicitacoes[index].status = novoStatus as any;
      this.salvarSolicitacoes(solicitacoes);
    }
  }

  // Adicionar observação a uma solicitação
  adicionarObservacaoSolicitacao(id: number, observacao: string) {
    const solicitacoes = this.listarSolicitacoes();
    const index = solicitacoes.findIndex(s => s.id === id);
    if (index !== -1) {
      solicitacoes[index].observacao = observacao;
      this.salvarSolicitacoes(solicitacoes);
    }
  }

  // =================== CRUD DE SERVIÇOS ===================
  
  // Criar novo serviço
  criarServico(servico: Omit<Servico, 'id'>): Servico {
    const servicos = this.listarServicos();
    const novoServico: Servico = {
      ...servico,
      id: Date.now()
    };
    servicos.push(novoServico);
    this.salvarServicos(servicos);
    return novoServico;
  }

  // Atualizar serviço
  atualizarServico(id: number, dadosAtualizados: Partial<Servico>): boolean {
    const servicos = this.listarServicos();
    const index = servicos.findIndex(s => s.id === id);
    
    if (index !== -1) {
      servicos[index] = { ...servicos[index], ...dadosAtualizados };
      this.salvarServicos(servicos);
      return true;
    }
    return false;
  }

  // Deletar serviço
  deletarServico(id: number): boolean {
    const servicos = this.listarServicos();
    const servicosFiltrados = servicos.filter(s => s.id !== id);
    
    if (servicosFiltrados.length < servicos.length) {
      this.salvarServicos(servicosFiltrados);
      return true;
    }
    return false;
  }

  // =================== CRUD DE USUÁRIOS ===================
  
  // Criar novo usuário (admin pode criar)
  criarUsuario(nome: string, email: string, senha: string, tipo: 'admin' | 'user' = 'user'): Usuario | null {
    const usuarios = this.listarUsuarios();
    
    // Verificar se o email já existe
    if (usuarios.find(u => u.email === email)) {
      return null;
    }

    const novoUsuario: Usuario = {
      id: Date.now(),
      nome,
      email,
      senha,
      tipo
    };

    usuarios.push(novoUsuario);
    this.salvarUsuarios(usuarios);
    return novoUsuario;
  }

  // Atualizar usuário
  atualizarUsuario(id: number, dadosAtualizados: Partial<Usuario>): boolean {
    const usuarios = this.listarUsuarios();
    const index = usuarios.findIndex(u => u.id === id);
    
    if (index !== -1) {
      // Se estiver atualizando o email, verificar se não existe outro usuário com o mesmo email
      if (dadosAtualizados.email && dadosAtualizados.email !== usuarios[index].email) {
        if (usuarios.find(u => u.email === dadosAtualizados.email)) {
          return false; // Email já existe
        }
      }
      
      usuarios[index] = { ...usuarios[index], ...dadosAtualizados };
      this.salvarUsuarios(usuarios);
      
      // Se o usuário atualizado é o logado, atualizar a sessão
      const usuarioLogado = this.usuarioLogado();
      if (usuarioLogado && usuarioLogado.id === id) {
        const usuarioAtualizado = usuarios[index];
        localStorage.setItem('usuarioLogado', JSON.stringify(usuarioAtualizado));
        this.usuarioSubject.next(usuarioAtualizado);
      }
      
      return true;
    }
    return false;
  }

  // Deletar usuário
  deletarUsuario(id: number): boolean {
    const usuarios = this.listarUsuarios();
    
    // Verificar se não é o último admin
    const usuario = usuarios.find(u => u.id === id);
    if (usuario?.tipo === 'admin') {
      const admins = usuarios.filter(u => u.tipo === 'admin');
      if (admins.length === 1) {
        return false; // Não pode deletar o último admin
      }
    }
    
    const usuariosFiltrados = usuarios.filter(u => u.id !== id);
    
    if (usuariosFiltrados.length < usuarios.length) {
      this.salvarUsuarios(usuariosFiltrados);
      
      // Se deletou o usuário logado, fazer logout
      const usuarioLogado = this.usuarioLogado();
      if (usuarioLogado && usuarioLogado.id === id) {
        this.logout();
      }
      
      return true;
    }
    return false;
  }

  // Alterar tipo de usuário (user <-> admin)
  alterarTipoUsuario(id: number, novoTipo: 'admin' | 'user'): boolean {
    const usuarios = this.listarUsuarios();
    const usuario = usuarios.find(u => u.id === id);
    
    // Se está tentando mudar admin para user, verificar se não é o último admin
    if (usuario?.tipo === 'admin' && novoTipo === 'user') {
      const admins = usuarios.filter(u => u.tipo === 'admin');
      if (admins.length === 1) {
        return false; // Não pode mudar o último admin
      }
    }
    
    return this.atualizarUsuario(id, { tipo: novoTipo });
  }

  // Alterar senha de usuário (admin alterando outro usuário)
  alterarSenhaUsuario(id: number, novaSenha: string): boolean {
    return this.atualizarUsuario(id, { senha: novaSenha });
  }
}
