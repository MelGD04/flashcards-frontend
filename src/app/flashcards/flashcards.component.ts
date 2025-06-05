import { Inject, Component, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AuthService } from './../services/auth.service';
import { ThemeService } from './../services/theme.service';
import { FlashcardsService } from './../services/flashcards.service';
import { CrudCardModalComponent } from "../modals/crud-card-modal/crud-card-modal.component";
import { FilterModalComponent } from "../modals/filter-modal/filter-modal.component";
import { CategoryService } from '../services/category.service';

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
  categories: string[] = [];

  private isBrowser: boolean;

  constructor(
    private flashcardsService: FlashcardsService,
    private themeService: ThemeService,
    private authService: AuthService,
    private categoryService: CategoryService,
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
      return; // Si el usuario no está autenticado, no se cargan las tarjetas
    }

    this.isLoading = true;
    this.flashcardsService.getFlashcards().subscribe(
      data => {
        this.flashcards = data;
        if (this.flashcards.length) {
          this.currentIndex = 0;
          this.currentCard = this.flashcards[0]; // Asigna la primera tarjeta como la actual
          this.flashcardsService.setCurrentCard(this.currentCard); // Actualiza el servicio compartido
          this.checkIfFavorite(this.currentCard.card_id); // Verifica si la tarjeta es favorita
        } else {
          console.warn('No flashcards found.');
          this.currentCard = null; // No hay tarjetas disponibles
        }
      },
      error => this.handleError(error, 'Error fetching flashcards.'),
      () => (this.isLoading = false) // Finaliza la carga
    );
  }

  previousCard(): void {
    this.navigateToCard(this.currentIndex - 1);
  }

  nextCard(): void {
    this.navigateToCard(this.currentIndex + 1);
  }

  private navigateToCard(index: number): void {
    if (index < 0 || index >= this.flashcards.length) return; // Asegúrate de que el índice sea válido
    this.currentIndex = index;
    this.currentCard = this.flashcards[index]; // Actualiza la tarjeta actual en el componente
    this.flashcardsService.setCurrentCard(this.currentCard); // Actualiza la tarjeta actual en el servicio compartido
    this.checkIfFavorite(this.currentCard.card_id); // Verifica si la tarjeta es favorita
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

  applyFilters(filters: { category: string; difficulty: string }): void {
    console.log('Filters received:', filters); // Depuración

    const { category, difficulty } = filters;

    if (!category) {
      console.warn('No category selected. Cannot apply filters.');
      return;
    }

    this.isLoading = true;
    this.categoryService.getCardsByCategoryAndDifficulty(category, difficulty).subscribe(
      (data) => {
        this.flashcards = data;
        console.log('Filtered flashcards:', this.flashcards); // Depuración

        // Actualizar la tarjeta actual con la primera tarjeta filtrada
        if (this.flashcards.length > 0) {
          this.currentIndex = 0; // Reinicia el índice
          this.currentCard = this.flashcards[0]; // Asigna la primera tarjeta como la actual
        } else {
          this.currentCard = null; // No hay tarjetas disponibles
        }

        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching filtered flashcards:', error);
        this.isLoading = false;
      }
    );
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
