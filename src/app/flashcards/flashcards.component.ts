import { AuthService } from './../services/auth.service';
import { ThemeService } from './../services/theme.service';
import { Component } from '@angular/core';
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
  showStatsSidebar = false;
  isLoading: boolean = false;

  constructor(
    public flashcardsService: FlashcardsService,
    private themeService: ThemeService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isAuthenticated();
    this.loadFlashcards();

    this.themeService.getTheme().subscribe((isLight) => {
      this.isLightTheme = isLight;
    });
  }

  loadFlashcards(): void {
    if (!this.isLoggedIn) {
      console.warn('User is not authenticated. Skipping request.');
      return;
    }

    this.isLoading = true;
    this.flashcardsService.getFlashcards().subscribe(
      (data) => {
        this.flashcards = data;
        if (this.flashcards.length > 0) {
          this.currentCard = this.flashcards[0];
          this.checkIfFavorite(this.currentCard.card_id);
        } else {
          console.warn('No flashcards available.');
        }
      },
      (error) => {
        this.handleError(error, 'Error fetching flashcards.');
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  private navigateToCard(index: number): void {
    if (index >= 0 && index < this.flashcards.length) {
      this.currentCard = this.flashcards[index];
      this.checkIfFavorite(this.currentCard.card_id);
    } else {
      console.warn('Invalid card index:', index);
    }
  }

  previousCard(): void {
    const currentIndex = this.flashcards.indexOf(this.currentCard);
    this.navigateToCard(currentIndex - 1);
  }

  nextCard(): void {
    const currentIndex = this.flashcards.indexOf(this.currentCard);
    this.navigateToCard(currentIndex + 1);
  }

  checkIfFavorite(cardId: number): void {
    if (!cardId) {
      console.error('Card ID is undefined.');
      return;
    }

    this.flashcardsService.getFavoriteCards().subscribe(
      (favorites) => {
        this.isFavorite = favorites.some((card: any) => card.card_id === cardId);
      },
      (error) => {
        this.handleError(error, 'Error checking favorite status.');
      }
    );
  }

  toggleFavorite(): void {
    if (!this.currentCard || !this.currentCard.card_id) {
      console.error('Current card or card ID is undefined.');
      return;
    }

    const action = this.isFavorite
      ? this.flashcardsService.removeFavorite(this.currentCard.card_id)
      : this.flashcardsService.addFavorite(this.currentCard.card_id);

    action.subscribe(
      (response) => {
        this.isFavorite = !this.isFavorite;
      },
      (error) => {
        this.handleError(error, 'Error toggling favorite status.');
      }
    );
  }

  flipCard(): void {
    this.isFlipped = !this.isFlipped;
  }

  private handleError(error: any, defaultMessage: string): void {
    console.error(defaultMessage, error);
    this.errorMessage = error?.error?.message || defaultMessage;
  }
}

