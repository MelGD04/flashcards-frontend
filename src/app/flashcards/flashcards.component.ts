import { AuthService } from './../services/auth.service';
import { ThemeService } from './../services/theme.service';

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlashcardsService } from './../services/flashcards.service';
import { CrudCardModalComponent } from "../modals/crud-card-modal/crud-card-modal.component";
import { FilterModalComponent } from "../modals/filter-modal/filter-modal.component";



@Component({
  selector: 'app-flashcards',
  imports: [
    CommonModule,
    CrudCardModalComponent,
    FilterModalComponent
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
  revisedSet = new Set<number>();
  errorMessage: string = '';
  isFavorite: boolean = false;
  isLoggedIn: boolean = false;
  
  constructor(public flashcardService: FlashcardsService, private themeService: ThemeService, private authService: AuthService) { }

  ngOnInit():void {
    this.flashcardService.getFlashcards().subscribe(
      (data) => {
        console.log('Flashcards:', data); // Verifica los datos devueltos por el backend
        this.flashcards = data;
      },
      (error) => {
        console.error('Error fetching flashcards:', error);
      }
    );

    this.themeService.getTheme().subscribe((isLight) => {
      this.isLightTheme = isLight;
    });

    this.isLoggedIn = this.authService.isAuthenticated();
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
    this.nextCard();
  }

  markAsUnknown() {
    this.incorrectAnswers++;
    this.nextCard();
  }

  getAccuracy(): number {
    const total = this.correctAnswers + this.incorrectAnswers;
    return total === 0 ? 0 : Math.round((this.correctAnswers / total) * 100);
  }


}

