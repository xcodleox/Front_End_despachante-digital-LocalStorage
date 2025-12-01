import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AppService } from '../services/app.service';

export const adminGuard: CanActivateFn = (route, state) => {
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
  
  // Se está logado mas não é admin, redireciona para home
  if (usuario.tipo !== 'admin') {
    console.warn('Acesso negado: usuário não é administrador');
    router.navigate(['/']);
    return false;
  }
  
  // Usuário é admin, pode acessar
  return true;
};
