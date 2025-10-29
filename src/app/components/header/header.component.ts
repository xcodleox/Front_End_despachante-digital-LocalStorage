import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AppService, Usuario } from '../../services/app.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-md transition-colors duration-300">
      <div class="container mx-auto px-4">
        <nav class="flex items-center justify-between h-20">
          <!-- Logo -->
          <div class="flex items-center">
            <a (click)="navigate('')" class="cursor-pointer hover:opacity-80 transition-opacity">
              <h1 class="text-2xl md:text-3xl font-semibold">
                Despachante<span class="text-blue-600">Digital</span>
              </h1>
            </a>
          </div>

          <!-- Desktop Menu -->
          <div class="hidden md:flex items-center gap-6">
            <a (click)="navigate('')" class="hover:text-blue-600 transition-colors cursor-pointer" [class.text-blue-600]="isActive('')">
              Início
            </a>
            <a (click)="navigate('servicos')" class="hover:text-blue-600 transition-colors cursor-pointer" [class.text-blue-600]="isActive('servicos')">
              Serviços
            </a>
            <a (click)="navigate('sobre')" class="hover:text-blue-600 transition-colors cursor-pointer" [class.text-blue-600]="isActive('sobre')">
              Sobre
            </a>
            <a (click)="navigate('solicitacoes')" class="hover:text-blue-600 transition-colors cursor-pointer" [class.text-blue-600]="isActive('solicitacoes')">
              Solicitações
            </a>
            <a (click)="navigate('contatos')" class="hover:text-blue-600 transition-colors cursor-pointer" [class.text-blue-600]="isActive('contatos')">
              Contatos
            </a>
            
            @if (usuario) {
              <div class="relative">
                <button 
                  (click)="toggleUserMenu()"
                  class="flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  {{ usuario.nome }}
                </button>
                
                @if (showUserMenu) {
                  <div class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 border border-border">
                    @if (usuario.tipo === 'admin') {
                      <a (click)="navigate('admin')" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                        Painel Admin
                      </a>
                    } @else {
                      <a (click)="navigate('usuario')" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                        Minhas Solicitações
                      </a>
                    }
                    <button (click)="logout()" class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600">
                      Sair
                    </button>
                  </div>
                }
              </div>
            } @else {
              <button 
                (click)="navigate('login')"
                class="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Login
              </button>
            }
          </div>

          <!-- Mobile Menu Button -->
          <button 
            (click)="toggleMobileMenu()"
            class="md:hidden p-2"
            aria-label="Toggle menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="4" x2="20" y1="12" y2="12"/>
              <line x1="4" x2="20" y1="6" y2="6"/>
              <line x1="4" x2="20" y1="18" y2="18"/>
            </svg>
          </button>
        </nav>

        <!-- Mobile Menu -->
        @if (showMobileMenu) {
          <div class="md:hidden pb-4 space-y-2">
            <a (click)="navigate('')" class="block py-2 hover:text-blue-600 transition-colors cursor-pointer">Início</a>
            <a (click)="navigate('servicos')" class="block py-2 hover:text-blue-600 transition-colors cursor-pointer">Serviços</a>
            <a (click)="navigate('sobre')" class="block py-2 hover:text-blue-600 transition-colors cursor-pointer">Sobre</a>
            <a (click)="navigate('solicitacoes')" class="block py-2 hover:text-blue-600 transition-colors cursor-pointer">Solicitações</a>
            <a (click)="navigate('contatos')" class="block py-2 hover:text-blue-600 transition-colors cursor-pointer">Contatos</a>
            
            @if (usuario) {
              @if (usuario.tipo === 'admin') {
                <a (click)="navigate('admin')" class="block py-2 hover:text-blue-600 transition-colors cursor-pointer">Painel Admin</a>
              } @else {
                <a (click)="navigate('usuario')" class="block py-2 hover:text-blue-600 transition-colors cursor-pointer">Minhas Solicitações</a>
              }
              <button (click)="logout()" class="block py-2 text-red-600 text-left w-full">Sair</button>
            } @else {
              <button (click)="navigate('login')" class="block py-2 text-blue-600 text-left w-full">Login</button>
            }
          </div>
        }
      </div>
    </header>
  `,
  styles: []
})
export class HeaderComponent implements OnInit {
  usuario: Usuario | null = null;
  showMobileMenu = false;
  showUserMenu = false;
  currentRoute = '';

  constructor(
    private router: Router,
    private appService: AppService
  ) {}

  ngOnInit() {
    this.appService.usuario$.subscribe(usuario => {
      this.usuario = usuario;
    });

    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url;
      this.showMobileMenu = false;
      this.showUserMenu = false;
    });
  }

  navigate(path: string) {
    this.router.navigate([path || '/']);
    this.showMobileMenu = false;
    this.showUserMenu = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  toggleMobileMenu() {
    this.showMobileMenu = !this.showMobileMenu;
    this.showUserMenu = false;
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  logout() {
    this.appService.logout();
    this.showUserMenu = false;
  }

  isActive(path: string): boolean {
    return this.currentRoute === `/${path}` || (path === '' && this.currentRoute === '/');
  }
}
