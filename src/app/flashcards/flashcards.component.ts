import { ThemeService } from './../services/theme.service';

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlashcardsService } from './../services/flashcards.service';
import { Flashcard } from '../models/flashcard.model';



@Component({
  selector: 'app-flashcards',
  imports: [
    CommonModule
  ],
  templateUrl: './flashcards.component.html',
  styleUrl: './flashcards.component.css'
})
export class FlashcardsComponent {
  flashcards: any[] = [];
  currentIndex: number = 0;
  showCard = true;
  animation = '';
  isFlipped = false;
  isLightTheme = true;
  totalCards = 0;
  revisedSet = new Set<number>();
  errorMessage: string = '';
  
  constructor(public flashcardService: FlashcardsService, private themeService: ThemeService) { }

  ngOnInit() {
    this.flashcardService.getFlashcards().subscribe(
      data => {
        this.flashcards = data;  // Al recibir los datos, los almacena en 'flashcards'
        this.errorMessage = '';  // Limpiar el mensaje de error en caso de éxito
      },
      error => {
        this.errorMessage = 'Hubo un problema al obtener las flashcards. Por favor, intente de nuevo más tarde.';
        console.error('Error al obtener flashcards', error);
      }
    );
    this.totalCards = this.flashcards.length;

    this.themeService.getTheme().subscribe((isLight) => {
      this.isLightTheme = isLight;
    });
  }

  nextCard() {
    this.animation = 'slide-out-left';
    this.showCard = false;

    setTimeout(() => {
      this.currentIndex = (this.currentIndex + 1) % this.flashcards.length;
      this.animation = 'slide-in-right';
      if (this.isFlipped) {
        this.flipCard();
      }
      this.showCard = true;
    }, 70);
  }

  previousCard() {
    this.animation = 'slide-out-right';
    this.showCard = false;

    setTimeout(() => {
      this.currentIndex = (this.currentIndex - 1 + this.flashcards.length) % this.flashcards.length;
      this.animation = 'slide-in-left';
      if (this.isFlipped) {
        this.flipCard();
      }
      this.showCard = true;
    }, 70);
  }


  flipCard() {
    this.isFlipped = !this.isFlipped;
  }

  get revisedCards(): number {
    return this.revisedSet.size;
  }

  get currentCard() {
    return this.flashcards[this.currentIndex];
  }

  isFavorite:boolean=false;

  toggleFavorite(){
    this.isFavorite = !this.isFavorite;
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }


  correctAnswers = 0;
  incorrectAnswers = 0;

  markAsKnown() {
    this.correctAnswers++;
    this.nextCard(); // o como avances
  }

  markAsUnknown() {
    this.incorrectAnswers++;
    this.nextCard(); // o como avances
  }

  getAccuracy(): number {
    const total = this.correctAnswers + this.incorrectAnswers;
    return total === 0 ? 0 : Math.round((this.correctAnswers / total) * 100);
  }


}

