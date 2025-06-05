import { Component, OnInit } from '@angular/core';
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
  flashcards: any[] = []; // Lista de tarjetas
  categories: any[] = []; // Lista de categorías
  currentFlashcard: any = null; // Tarjeta actualmente seleccionada
  newCategoryName: string = ''; // Nombre de la nueva categoría
  isLightTheme = true; // Tema actual
  isLoading = false; // Estado de carga
  errorMessage: string | null = null; // Mensaje de error
  currentIndex = 0;

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

    // Cargar las tarjetas y categorías al iniciar
    this.loadFlashcards();
    this.loadCategories();
  }

  toggleTheme(): void {
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
        } else {
          this.currentFlashcard = null; // No hay tarjetas disponibles
        }
      },
      (error) => {
        console.error('Error fetching flashcards:', error);
        this.errorMessage = 'Failed to load flashcards.';
        this.currentFlashcard = null; // Manejar el error adecuadamente
      },
      () => {
        this.isLoading = false;
      }
    );
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
      },
      error: (error) => {
        console.error('Error adding category:', error);
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
      },
      (error) => {
        console.error('Error updating card:', error);
        this.errorMessage = 'Failed to update card.';
      },
      () => {
        this.isLoading = false;
        location.reload();
      }
    );
  }

  // Eliminar una tarjeta
  deleteCard(cardId: number): void {
    console.log('Deleting card with ID:', cardId);
    this.flashcardsService.deleteCard(cardId).subscribe({
    });
  }

  // Cambiar la tarjeta activa
  setCurrentFlashcard(card: any): void {
    this.currentFlashcard = card;
  }


}
