import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AppService, Usuario } from '../../services/app.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
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
