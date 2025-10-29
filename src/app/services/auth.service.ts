import { Injectable, signal } from '@angular/core';

export type UserType = 'user' | 'admin';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn = signal(false);
  userType = signal<UserType | null>(null);

  login(tipo: UserType): void {
    this.isLoggedIn.set(true);
    this.userType.set(tipo);
    
    // Salvar no localStorage
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userType', tipo);
  }

  logout(): void {
    this.isLoggedIn.set(false);
    this.userType.set(null);
    
    // Remover do localStorage
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userType');
  }

  checkAuth(): void {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userType = localStorage.getItem('userType') as UserType | null;
    
    if (isLoggedIn && userType) {
      this.isLoggedIn.set(true);
      this.userType.set(userType);
    }
  }
}
