import { Inject, Component, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AuthService } from './../services/auth.service';
import { ThemeService } from './../services/theme.service';
import { FlashcardsService } from './../services/flashcards.service';
import { CrudCardModalComponent } from "../modals/crud-card-modal/crud-card-modal.component";
import { FilterModalComponent } from "../modals/filter-modal/filter-modal.component";

@Component({
  selector: 'app-flashcards',
  standalone: true,
  imports: [
    CommonModule,
    CrudCardModalComponent,
    FilterModalComponent
  ],
  templateUrl: './flashcards.component.html',
  styleUrls: ['./flashcards.component.css']
})
export class FlashcardsComponent implements OnInit {
  flashcards: any[] = [];
  currentCard: any = null;
  currentIndex = 0;
  isFlipped = false;
  isLightTheme = true;
  isFavorite = false;
  isLoggedIn = false;
  isLoading = false;
  errorMessage = '';

  private isBrowser: boolean;

  constructor(
    private flashcardsService: FlashcardsService,
    private themeService: ThemeService,
    private authService: AuthService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.isLoggedIn = this.authService.isAuthenticated();
      if (this.isLoggedIn) {
        this.loadFlashcards();
      }
    } else {
      console.warn('Not running in a browser environment.');
    }

    this.themeService.getTheme().subscribe(isLight => {
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
      data => {
        this.flashcards = data;
        if (this.flashcards.length) {
          this.currentIndex = 0;
          this.currentCard = this.flashcards[0];
          this.checkIfFavorite(this.currentCard.card_id);
        }
      },
      error => this.handleError(error, 'Error fetching flashcards.'),
      () => (this.isLoading = false)
    );
  }

  previousCard(): void {
    this.navigateToCard(this.currentIndex - 1);
  }

  nextCard(): void {
    this.navigateToCard(this.currentIndex + 1);
  }

  private navigateToCard(index: number): void {
    if (index < 0 || index >= this.flashcards.length) return;
    this.currentIndex = index;
    this.currentCard = this.flashcards[index];
    this.checkIfFavorite(this.currentCard.card_id);
  }

  checkIfFavorite(cardId: number): void {
    this.flashcardsService.getFavoriteCards().subscribe(
      favorites => {
        this.isFavorite = favorites.some((c: any) => c.card_id === cardId);
      },
      error => this.handleError(error, 'Error checking favorite status.')
    );
  }

  toggleFavorite(): void {
    if (!this.currentCard?.card_id) {
      console.warn('No card selected. Cannot toggle favorite status.');
      return;
    }

    const action = this.isFavorite
      ? this.flashcardsService.removeFavorite(this.currentCard.card_id)
      : this.flashcardsService.addFavorite(this.currentCard.card_id);

    action.subscribe(
      () => (this.isFavorite = !this.isFavorite),
      error => this.handleError(error, 'Error toggling favorite status.')
    );
  }

  flipCard(): void {
    this.isFlipped = !this.isFlipped;
  }

  private handleError(error: any, defaultMessage: string): void {
    console.error(defaultMessage, error);

    if (error.status === 401) {
      this.errorMessage = 'Session expired. Please log in again.';
      if (this.isBrowser) {
        this.authService.logout();
        location.href = '/login'; // Redirige al usuario al inicio de sesión
      }
    } else {
      this.errorMessage = error?.error?.detail || defaultMessage;
    }
  }
}
