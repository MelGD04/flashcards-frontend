import { Component } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { CommonModule } from '@angular/common';
import { FlashcardsService } from '../../services/flashcards.service';

@Component({
  selector: 'app-crud-card-modal',
  imports: [CommonModule],
  templateUrl: './crud-card-modal.component.html',
  styleUrl: './crud-card-modal.component.css'
})
export class CrudCardModalComponent {
  flashcards: any[] = []; // Lista de tarjetas
  currentFlashcard: any = null; // Tarjeta actualmente seleccionada
  isLightTheme = true;
  isLoading = false; // Estado de carga
  errorMessage: string | null = null; // Mensaje de error

  constructor(private themeService: ThemeService, private flashcardsService: FlashcardsService) { }

  ngOnInit() {
    // Escucha los cambios en el tema
    this.themeService.getTheme().subscribe((isLight) => {
      this.isLightTheme = isLight;
    });

    // Cargar las tarjetas al iniciar
    this.loadFlashcards();
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  // Cargar todas las tarjetas
  loadFlashcards(): void {
    this.isLoading = true;
    this.flashcardsService.getFlashcards().subscribe(
      (data) => {
        this.flashcards = data;
        if (this.flashcards.length > 0) {
          this.currentFlashcard = this.flashcards[0]; // Seleccionar la primera tarjeta como activa
        }
      },
      (error) => {
        console.error('Error fetching flashcards:', error);
        this.errorMessage = 'Failed to load flashcards.';
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  // Eliminar la tarjeta actualmente seleccionada
  deleteCurrentCard(): void {
    if (!this.currentFlashcard) {
      this.errorMessage = 'No flashcard selected.';
      return;
    }

    const cardId = this.currentFlashcard.card_id; // Usa card_id en lugar de id
    this.isLoading = true;
    this.flashcardsService.deleteCard(cardId).subscribe(
      (response) => {
        console.log('Card deleted successfully:', response);
        // Eliminar la tarjeta de la lista local
        this.flashcards = this.flashcards.filter((card) => card.card_id !== cardId);

        // Actualizar la tarjeta activa
        if (this.flashcards.length > 0) {
          this.currentFlashcard = this.flashcards[0]; // Seleccionar la siguiente tarjeta
        } else {
          this.currentFlashcard = null; // No hay tarjetas restantes
        }
      },
      (error) => {
        console.error('Error deleting card:', error);
        this.errorMessage = 'Failed to delete card.';
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  // Cambiar la tarjeta activa
  setCurrentFlashcard(card: any): void {
    this.currentFlashcard = card;
  }
}
