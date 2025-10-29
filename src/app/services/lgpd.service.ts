import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LgpdService {
  private aceitouLGPDSubject = new BehaviorSubject<boolean>(this.verificarConsentimento());
  aceitouLGPD$ = this.aceitouLGPDSubject.asObservable();

  constructor() {}

  private verificarConsentimento(): boolean {
    const consentimento = localStorage.getItem('lgpd_aceito');
    return consentimento === 'true';
  }

  aceitarLGPD() {
    localStorage.setItem('lgpd_aceito', 'true');
    this.aceitouLGPDSubject.next(true);
  }

  revisarConsentimento() {
    localStorage.removeItem('lgpd_aceito');
    this.aceitouLGPDSubject.next(false);
  }

  getEstadoConsentimento(): boolean {
    return this.aceitouLGPDSubject.value;
  }
}
