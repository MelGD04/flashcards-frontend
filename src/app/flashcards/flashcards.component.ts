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
  isLightTheme = true;
  totalCards = 0;
  revisedSet = new Set<number>();
  
  constructor(public flashcardService: FlashcardsService, private themeService: ThemeService) { }

  ngOnInit() {
    this.flashcards = this.flashcardService.getFlashcards();
    this.totalCards = this.flashcards.length;

    this.themeService.getTheme().subscribe((isLight) => {
      this.isLightTheme = isLight;
    });
  }
  // Métodos para acceder a la lógica desde el servicio
  flipCard() {
    this.flashcardService.flipCard();
  }

  nextCard() {
    if (this.currentIndex < this.flashcards.length) {
      this.currentIndex++;
      this.flashcardService.nextCard();

      // Si no se había revisado esta tarjeta, agrégala al set
      this.revisedSet.add(this.currentIndex);
    }
  }

  previousCard() {
    if (this.currentIndex > 0) {
      // Quitamos del set si vamos hacia atrás
      this.revisedSet.delete(this.currentIndex);

      this.currentIndex--;
      this.flashcardService.previousCard();
    }
  }

  get revisedCards(): number {
    return this.revisedSet.size;
  }

  get currentCard() {
    return this.flashcardService.currentCard;
  }

  get isFlipped() {
    return this.flashcardService.isFlipped;
  }

  isFavorite:boolean=false;

  toggleFavorite(){
    this.isFavorite = !this.isFavorite;
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  currentIndex = 0;

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

