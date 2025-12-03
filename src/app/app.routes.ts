import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ServicesListComponent } from './components/services-list/services-list.component';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { 
    path: '', 
    component: HomeComponent, // dexei pra carregar o componente junto com site
    title: 'DespachanteDigital - Início'
  },
  { 
    path: 'servicos', 
    component: ServicesListComponent,// dexei pra carregar o componente junto com site
    title: 'Serviços - DespachanteDigital'
  },
  {
    path: 'sobre',
    loadComponent: () => import('./components/about/about.component').then(m => m.AboutComponent),
    title: 'Sobre - DespachanteDigital'
  },
  {
    path: 'contatos',
    loadComponent: () => import('./components/contacts/contacts.component').then(m => m.ContactsComponent),
    title: 'Contatos - DespachanteDigital'
  },
  {
    path: 'privacidade',
    loadComponent: () => import('./components/privacy-policy/privacy-policy.component').then(m => m.PrivacyPolicyComponent),
    title: 'Política de Privacidade - DespachanteDigital'
  },
  {
    path: 'termos-de-uso',
    loadComponent: () => import('./components/terms-of-use/terms-of-use.component').then(m => m.TermsOfUseComponent),
    title: 'Termos de Uso - DespachanteDigital'
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent),
    title: 'Login - DespachanteDigital'
  },
  {
    path: 'solicitacoes',
    loadComponent: () => import('./components/request-form/request-form.component').then(m => m.RequestFormComponent),
    title: 'Solicitações - DespachanteDigital'
  },
  {
    path: 'comprovante',
    loadComponent: () => import('./components/receipt/receipt.component').then(m => m.ReceiptComponent),
    title: 'Comprovante - DespachanteDigital'
  },
  
  {
    path: 'usuario',
    loadComponent: () => import('./components/user-panel/user-panel.component').then(m => m.UserPanelComponent),
    canActivate: [authGuard],
    title: 'Minhas Solicitações - DespachanteDigital'
  },
  {
    path: 'admin',
    loadComponent: () => import('./components/admin-panel/admin-panel.component').then(m => m.AdminPanelComponent),
    canActivate: [adminGuard],
    title: 'Painel Admin - DespachanteDigital'
  },
  {
    path: 'admin/servicos',
    loadComponent: () => import('./components/services-management/services-management.component').then(m => m.ServicesManagementComponent),
    canActivate: [adminGuard],
    title: 'Gerenciar Serviços - DespachanteDigital'
  },
  {
    path: 'admin/solicitacoes',
    loadComponent: () => import('./components/requests-management/requests-management.component').then(m => m.RequestsManagementComponent),
    canActivate: [adminGuard],
    title: 'Gerenciar Solicitações - DespachanteDigital'
  },
  {
    path: 'admin/usuarios',
    loadComponent: () => import('./components/user-management/user-management.component').then(m => m.UserManagementComponent),
    canActivate: [adminGuard],
    title: 'Gerenciar Usuários - DespachanteDigital'
  },
  
  // Rota 404
  { 
    path: '**', 
    redirectTo: '' 
  }
];
