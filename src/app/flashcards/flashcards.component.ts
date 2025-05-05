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
  isFlipped = false;
  isLightTheme = true;
  errorMessage: string = '';
  isFavorite: boolean = false;
  isLoggedIn: boolean = false;
  currentCard: any = null;

  constructor(public flashcardsService: FlashcardsService, private themeService: ThemeService, private authService: AuthService) { }

  ngOnInit(): void {
    this.loadFlashcards();

    this.themeService.getTheme().subscribe((isLight) => {
      this.isLightTheme = isLight;
    });

    this.isLoggedIn = this.authService.isAuthenticated();
  }

  // Cargar todas las tarjetas
  loadFlashcards(): void {
    this.flashcardsService.getFlashcards().subscribe(
      (data) => {
        this.flashcards = data;
        if (this.flashcards.length > 0) {
          this.currentCard = this.flashcards[0];
          console.log('Current card loaded with ID:', this.currentCard.card_id);
          this.checkIfFavorite(this.currentCard.card_id); // Verifica si la tarjeta actual es favorita
        } else {
          console.warn('No flashcards available.');
        }
      },
      (error) => {
        console.error('Error fetching flashcards:', error);
      }
    );
  }

  // Verificar si la tarjeta actual es favorita
  checkIfFavorite(cardId: number): void {
    if (!cardId) {
      console.error('Card ID is undefined.');
      return;
    }

    this.flashcardsService.getFavoriteCards().subscribe(
      (favorites) => {
        this.isFavorite = favorites.some((card: any) => card.card_id === cardId); // Verifica si la tarjeta está en favoritos
      },
      (error) => {
        console.error('Error checking favorite status:', error);
      }
    );
  }

  // Alternar estado de favorito
  toggleFavorite(): void {
    if (!this.currentCard || !this.currentCard.card_id) {
      console.error('Current card or card ID is undefined.');
      return;
    }

    if (this.isFavorite) {
      // Eliminar de favoritos
      this.flashcardsService.removeFavorite(this.currentCard.card_id).subscribe(
        (response) => {
          console.log('Card removed from favorites:', response);
          this.isFavorite = false; // Cambiar el estado a no favorito
        },
        (error) => {
          console.error('Error removing card from favorites:', error);
        }
      );
    } else {
      // Agregar a favoritos
      this.flashcardsService.addFavorite(this.currentCard.card_id).subscribe(
        (response) => {
          console.log('Card added to favorites:', response);
          this.isFavorite = true; // Cambiar el estado a favorito
        },
        (error) => {
          console.error('Error adding card to favorites:', error);
        }
      );
    }
  }

  // Navegar a la tarjeta anterior
  previousCard(): void {
    const currentIndex = this.flashcards.indexOf(this.currentCard);
    if (currentIndex > 0) {
      this.currentCard = this.flashcards[currentIndex - 1];
      console.log('Navigated to previous card with ID:', this.currentCard.id); // Mostrar el ID de la tarjeta
      if (this.currentCard && this.currentCard.card_id) {
        this.checkIfFavorite(this.currentCard.card_id); // Verifica si la nueva tarjeta es favorita
      } else {
        console.error('Previous card or card ID is undefined.');
      }
    }
  }

  // Navegar a la tarjeta siguiente
  nextCard(): void {
    const currentIndex = this.flashcards.indexOf(this.currentCard);
    if (currentIndex < this.flashcards.length - 1) {
      this.currentCard = this.flashcards[currentIndex + 1];
      console.log('Navigated to next card with ID:', this.currentCard.id); // Mostrar el ID de la tarjeta
      if (this.currentCard && this.currentCard.card_id) {
        this.checkIfFavorite(this.currentCard.card_id); // Verifica si la nueva tarjeta es favorita
      } else {
        console.error('Next card or card ID is undefined.');
      }
    }
  }

  // Voltear la tarjeta
  flipCard(): void {
    this.isFlipped = !this.isFlipped;
  }
}

