import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AppService } from '../services/app.service';

export const authGuard: CanActivateFn = (route, state) => {
  const appService = inject(AppService);
  const router = inject(Router);
  
  const usuario = appService.usuarioLogado();
  
  if (!usuario) {
    console.warn('Acesso negado: usuário não autenticado');
    router.navigate(['/login'], { 
      queryParams: { returnUrl: state.url } 
    });
    return false;
  }
  
  return true; // retorno par quem foi autenticado é liberado!!
};
