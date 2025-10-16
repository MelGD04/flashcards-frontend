import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { CommonModule } from '@angular/common';
import { FlashcardsService } from '../../services/flashcards.service';
import { CategoryService } from '../../services/category.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-crud-card-modal',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './crud-card-modal.component.html',
  styleUrls: ['./crud-card-modal.component.css']
})
export class CrudCardModalComponent implements OnInit {
  @Input() currentFlashcard: any = null; // Tarjeta actualmente seleccionada
  @Input() categories: any[] = []; // Lista de categorías
  @Output() cardDeleted = new EventEmitter<number>(); // Notificar al componente padre sobre la eliminación
  @Output() cardUpdated = new EventEmitter<any>(); // Notificar al componente padre sobre la actualización

  newCategoryName: string = ''; // Nombre de la nueva categoría
  isLightTheme = true; // Tema actual
  isLoading = false; // Estado de carga
  errorMessage: string | null = null; // Mensaje de error

  constructor(
    private themeService: ThemeService,
    private flashcardsService: FlashcardsService,
    private categoryService: CategoryService // Servicio para manejar categorías
  ) { }

  ngOnInit(): void {
    // Escucha los cambios en el tema
    this.themeService.getTheme().subscribe((isLight) => {
      this.isLightTheme = isLight;
    });

    // Cargar las categorías al iniciar
    this.loadCategories();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  // Cargar todas las categorías
  loadCategories(): void {
    this.categoryService.getCategories().subscribe(
      (data) => {
        this.categories = data;
        console.log('Categories loaded:', this.categories);
      },
      (error) => {
        console.error('Error fetching categories:', error);
        this.errorMessage = 'Failed to load categories.';
      }
    );
  }

  // Agregar una nueva categoría
  addCategory(): void {
    if (!this.newCategoryName.trim()) {
      this.errorMessage = 'Category name cannot be empty.';
      return;
    }

    this.categoryService.createCategory({ category_name: this.newCategoryName }).subscribe({
      next: (response) => {
        this.newCategoryName = '';
        this.loadCategories(); // Recargar las categorías después de agregar una nueva
      },
      error: (error) => {
        console.error('Error adding category:', error);
        this.errorMessage = 'Failed to add category.';
      }
    });
  }

  // Actualizar una tarjeta
  updateCard(): void {
    if (!this.currentFlashcard) {
      this.errorMessage = 'No flashcard selected.';
      return;
    }

    const cardId = this.currentFlashcard.card_id; // Usa card_id como identificador
    const updatedData = {
      question: this.currentFlashcard.question,
      answer: this.currentFlashcard.answer,
      difficulty: this.currentFlashcard.difficulty,
      category: this.currentFlashcard.category
    };

    this.isLoading = true;
    this.flashcardsService.updateCard(cardId, updatedData).subscribe(
      (response) => {
        console.log('Card updated successfully:', response);
        this.errorMessage = null;
        this.cardUpdated.emit(response); // Notificar al componente padre sobre la actualización
      },
      (error) => {
        console.error('Error updating card:', error);
        this.errorMessage = 'Failed to update card.';
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  // Eliminar una tarjeta
  deleteCard(cardId: number): void {
    if (!cardId) {
      console.warn('No card ID provided. Cannot delete.');
      return;
    }

    console.log('Deleting card with ID:', cardId);
    this.flashcardsService.deleteCard(cardId).subscribe({
      next: () => {
        console.log(`Card with ID ${cardId} deleted successfully.`);
        this.currentFlashcard = null; // Limpiar la tarjeta actual después de eliminarla
        this.cardDeleted.emit(cardId); // Notificar al componente padre sobre la eliminación
      },
      error: (error) => {
        console.error('Error deleting card:', error);
        this.errorMessage = 'Failed to delete card.';
      }
    });
  }
}
