import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { AppService } from '../../services/app.service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit, OnDestroy {
  totalSolicitacoes = 0;
  totalUsuarios = 0;
  totalServicos = 0;
  adminNome = '';
  
  private routerSubscription?: Subscription;

  constructor(
    private appService: AppService,
    private router: Router
  ) {}

  ngOnInit() {
    const usuario = this.appService.obterUsuarioAtual();
    if (usuario) {
      this.adminNome = usuario.nome;
    }

    this.atualizarEstatisticas();
    
    // Atualiza estatísticas quando voltar para esta rota
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        if (event.url === '/admin') {
          this.atualizarEstatisticas();
        }
      });
  }

  ngOnDestroy() {
    this.routerSubscription?.unsubscribe();
  }

  atualizarEstatisticas() {
    // Estatísticas
    this.totalSolicitacoes = this.appService.listarTodasSolicitacoes().length;
    this.totalUsuarios = this.appService.listarTodosUsuarios().length;
    this.totalServicos = this.appService.listarServicos().length;
  }

  abrirGerenciamentoServicos() {
    this.router.navigate(['/admin/servicos']);
  }

  abrirGerenciamentoUsuarios() {
    this.router.navigate(['/admin/usuarios']);
  }

  abrirGerenciamentoSolicitacoes() {
    this.router.navigate(['/admin/solicitacoes']);
  }

  logout() {
    this.appService.logout();
    this.router.navigate(['/login']);
  }
}
