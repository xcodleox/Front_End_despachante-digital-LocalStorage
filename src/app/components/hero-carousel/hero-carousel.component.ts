import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Slide {
  img: string;
  title: string;
  text: string;
}

@Component({
  selector: 'app-hero-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero-carousel.component.html',
  styleUrls: ['./hero-carousel.component.css']
})
export class HeroCarouselComponent implements OnInit, OnDestroy {
  currentIndex = 0;
  private intervalId?: number;

  slides: Slide[] = [
    {
      img: 'https://images.unsplash.com/photo-1689232680702-d5f7acea7c95?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBkb2N1bWVudHMlMjBsaWNlbnNpbmd8ZW58MXx8fHwxNzYxNjcxOTA3fDA&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Transferência de Veículos',
      text: 'Todo o processo de transferência de forma digital e segura'
    },
    {
      img: 'https://images.unsplash.com/photo-1644058986421-237d141a9a66?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZWhpY2xlJTIwdHJhbnNmZXIlMjBwYXBlcndvcmt8ZW58MXx8fHwxNzYxNjcxOTA3fDA&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Licenciamento e IPVA',
      text: 'Controle completo sem sair de casa'
    },
    {
      img: 'https://images.unsplash.com/photo-1673235519869-e507871d2fb9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjByZWdpc3RyYXRpb24lMjBvZmZpY2V8ZW58MXx8fHwxNzYxNjcxOTA4fDA&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Regularização de Documentos',
      text: 'Resolver pendências nunca foi tão fácil'
    }
  ];

  ngOnInit() {
    this.startAutoPlay();
  }

  ngOnDestroy() {
    this.stopAutoPlay();
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    this.resetAutoPlay();
  }

  prevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    this.resetAutoPlay();
  }

  goToSlide(index: number) {
    this.currentIndex = index;
    this.resetAutoPlay();
  }

  private startAutoPlay() {
    this.intervalId = window.setInterval(() => {
      this.nextSlide();
    }, 4000);
  }

  private stopAutoPlay() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private resetAutoPlay() {
    this.stopAutoPlay();
    this.startAutoPlay();
  }
}
