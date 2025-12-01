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
    servico?: Servico;
    protocolo?: string; 
    dados: any;
    status: 'Pendente' | 'Em Andamento' | 'Concluído' | 'Cancelado' | 'Em andamento' | 'Pausado' | 'Finalizado';
    arquivos?: string[];
    data: string;
    chat?: Mensagem[];
    observacao?: string;
  }