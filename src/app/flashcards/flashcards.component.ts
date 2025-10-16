import { Inject, Component, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AuthService } from './../services/auth.service';
import { ThemeService } from './../services/theme.service';
import { FlashcardsService } from './../services/flashcards.service';
import { CrudCardModalComponent } from "../modals/crud-card-modal/crud-card-modal.component";
import { FilterModalComponent } from "../modals/filter-modal/filter-modal.component";
import { CategoryService } from '../services/category.service';
import { ProgressService } from '../services/progress.service';

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
  dominatedCount: number = 0;
  notDominatedCount: number = 0;
  currentCardState: string | null = null;
  revisedCards: number = 0;
  revisedCardIds: Set<number> = new Set(); // IDs de tarjetas revisadas

  private isBrowser: boolean;

  touchStartX: number = 0;
  touchEndX: number = 0;

  constructor(
    private flashcardsService: FlashcardsService,
    private themeService: ThemeService,
    private authService: AuthService,
    private categoryService: CategoryService,
    private progressService: ProgressService,
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

    // Marca la primera tarjeta como revisada al cargar el componente
    if (this.flashcards.length > 0) {
      this.revisedCardIds.add(this.flashcards[0].card_id); // Marca la primera tarjeta como revisada
      this.revisedCards = 1; // Inicializa el contador en 1
      this.updateProgressBar(); // Actualiza la barra de progreso
    }
  }

  loadFlashcards(): void {
    if (!this.isLoggedIn) {
      return; // Si el usuario no está autenticado, no se cargan las tarjetas
    }

    this.isLoading = true;
    this.flashcardsService.getFlashcards().subscribe(
      (data) => {
        this.flashcards = data;

        if (this.flashcards.length) {
          this.currentIndex = 0;
          this.currentCard = this.flashcards[0]; // Asigna la primera tarjeta como la actual
          this.flashcardsService.setCurrentCard(this.currentCard); // Actualiza el servicio compartido
          this.checkIfFavorite(this.currentCard.card_id); // Verifica si la tarjeta es favorita

          // Marca la primera tarjeta como revisada
          this.revisedCardIds.add(this.flashcards[0].card_id);
          this.revisedCards = 1;
          this.updateProgressBar();
        } else {
          console.warn('No flashcards found.');
          this.currentCard = null; // No hay tarjetas disponibles
        }
      },
      (error) => this.handleError(error, 'Error fetching flashcards.'),
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

    // Si avanzas a una tarjeta nueva, márcala como revisada
    if (index > this.currentIndex && !this.revisedCardIds.has(this.flashcards[index].card_id)) {
      this.revisedCardIds.add(this.flashcards[index].card_id); // Marca la tarjeta como revisada
      this.revisedCards++; // Incrementa el contador de tarjetas revisadas
    }

    // Si retrocedes y la tarjeta actual estaba marcada como revisada, desmárcala
    if (index < this.currentIndex && this.revisedCardIds.has(this.flashcards[this.currentIndex].card_id)) {
      this.revisedCardIds.delete(this.flashcards[this.currentIndex].card_id); // Elimina la tarjeta del conjunto de revisadas
      this.revisedCards--; // Decrementa el contador de tarjetas revisadas
    }

    // Actualiza el índice y la tarjeta actual
    this.currentIndex = index;
    this.currentCard = this.flashcards[index];
    this.flashcardsService.setCurrentCard(this.currentCard); // Actualiza el servicio compartido
    this.checkIfFavorite(this.currentCard.card_id); // Verifica si la tarjeta es favorita

    // Actualiza la barra de progreso
    this.updateProgressBar();
  }

  // Método para actualizar la barra de progreso
  private updateProgressBar(): void {
    const progressElement = document.querySelector('.progress-bar-vertical') as HTMLElement;
    const progressPercentage = (this.revisedCards / this.flashcards.length) * 100; // Basado en las tarjetas revisadas
    progressElement.style.height = `${progressPercentage}%`;
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


  selectCard(card: any): void {
    this.currentCard = card; // Establece la tarjeta seleccionada como la actual
    console.log('Selected card:', this.currentCard);
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

  onCardDeleted(cardId: number): void {
    // Elimina la tarjeta de la lista local
    this.flashcards = this.flashcards.filter(card => card.card_id !== cardId);

    // Recalcula los contadores
    this.revisedCards = this.flashcards.filter(card => this.revisedCardIds.has(card.card_id)).length;
    this.dominatedCount = this.flashcards.filter(card => card.estado === 'dominates').length;
    this.notDominatedCount = this.flashcards.filter(card => card.estado === 'does_not_dominate').length;

    // Actualiza la barra de progreso
    this.updateProgressBar();

    console.log('Card deleted:', cardId);
    console.log('Updated progress:', {
      revisedCards: this.revisedCards,
      dominatedCount: this.dominatedCount,
      notDominatedCount: this.notDominatedCount,
    });
  }

  onCardUpdated(updatedCard: any): void {
    const index = this.flashcards.findIndex(card => card.card_id === updatedCard.card_id);
    if (index !== -1) {
      this.flashcards[index] = updatedCard; // Actualiza la tarjeta en la lista
      console.log(`Card with ID ${updatedCard.card_id} updated successfully.`);
    }
  }

  // Método para actualizar el progreso de una tarjeta
  updateCardProgress(cardId: number, accion: string): void {
    console.log(`Updating progress for card ${cardId} with action ${accion}`);

    // Actualiza los contadores localmente
    if (accion === 'dominates') {
      this.dominatedCount++;
    } else if (accion === 'does_not_dominate') {
      this.notDominatedCount++;
    }

    // Actualiza el estado de la tarjeta actual
    this.currentCardState = accion;

    console.log('Updated counts:', {
      dominated: this.dominatedCount,
      notDominated: this.notDominatedCount,
    });
  }

  // Método para obtener la precisión basada en las tarjetas dominadas
  getPrecision(): number {
    const totalMarked = this.dominatedCount + this.notDominatedCount;
    if (totalMarked === 0) {
      return 0; // Evita divisiones por cero
    }
    return (this.dominatedCount / totalMarked) * 100;
  }

  ngOnDestroy(): void {
    this.resetProgress(); // Reinicia los contadores al salir del componente
  }

  resetProgress(): void {
    this.dominatedCount = 0;
    this.notDominatedCount = 0;
    this.currentCardState = null;
    console.log('Progress reset');
  }

  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.changedTouches[0].screenX;
  }

  onTouchEnd(event: TouchEvent) {
    this.touchEndX = event.changedTouches[0].screenX;
    this.handleSwipe();
  }

  handleSwipe() {
    const minSwipeDistance = 50; // píxeles mínimos para considerar swipe
    const deltaX = this.touchEndX - this.touchStartX;
    if (Math.abs(deltaX) > minSwipeDistance) {
      if (deltaX > 0) {
        this.previousCard(); // Swipe derecha
      } else {
        this.nextCard(); // Swipe izquierda
      }
    }
  }
}
