import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AppService } from '../services/app.service';

/**
 * Guard para proteger rotas que requerem autenticação
 * Verifica se o usuário está logado (admin ou user)
 */
export const authGuard: CanActivateFn = (route, state) => {
  const appService = inject(AppService);
  const router = inject(Router);
  
  const usuario = appService.usuarioLogado();
  
  // Se não está logado, redireciona para login
  if (!usuario) {
    console.warn('Acesso negado: usuário não autenticado');
    router.navigate(['/login'], { 
      queryParams: { returnUrl: state.url } 
    });
    return false;
  }
  
  // Usuário autenticado, pode acessar
  return true;
};
