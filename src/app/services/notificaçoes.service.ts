import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  loginSuccess() {
    Swal.fire({
      icon: 'success',
      title: 'Login realizado!',
      text: 'Bem-vindo de volta à plataforma.',
      timer: 3000,
      showConfirmButton: false
    });
  }

  logoutSuccess() {
    Swal.fire({
      icon: 'info',
      title: 'Logout efetuado',
      text: 'Você saiu da sua conta. Até breve!',
      timer: 3000,
      showConfirmButton: false
    });
  }

  loginError() {
    Swal.fire({
      icon: 'error',
      title: 'Erro ao logar',
      text: 'Verifique suas credenciais e tente novamente.',
    });
  }

  logoutError() {
    Swal.fire({
      icon: 'error',
      title: 'Erro ao sair',
      text: 'Tente novamente mais tarde.',
    });
  }

  loginNotFound() {
  Swal.fire({
    icon: 'error',
    title: 'Login não encontrado',
    text: 'Este e-mail não está cadastrado.',
  });
}

wrongPassword() {
  Swal.fire({
    icon: 'error',
    title: 'Senha incorreta',
    text: 'Verifique sua senha e tente novamente.',
  });
}

  customMessage(icon: 'success' | 'error' | 'info' | 'warning', title: string, text: string, timer: number = 3000) {
    Swal.fire({
      icon,
      title,
      text,
      timer,
      showConfirmButton: false
    });
  }
}