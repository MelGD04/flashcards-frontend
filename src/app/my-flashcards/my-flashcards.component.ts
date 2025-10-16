import { CategoryService } from './../services/category.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FlashcardsService } from './../services/flashcards.service';
import { ThemeService } from '../services/theme.service';

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-my-flashcards',
  imports: [
    CommonModule
  ],
  templateUrl: './my-flashcards.component.html',
  styleUrl: './my-flashcards.component.css'
})
export class MyFlashcardsComponent implements OnInit {
  categories: any[] = []; // Lista de categorías existentes
  flashcards: any[] = []; // Lista de flashcards de la categoría seleccionada
  newCategoryName: string = ''; // Nombre de la nueva categoría
  selectedCategory: string | null = null; // Categoría seleccionada
  isLightTheme = true; // Tema actual
  flashcardsByCategory: { [key: string]: any[] } = {}; // Flashcards agrupadas por categoría
  isLoggedIn: boolean = false;

  constructor(
    private flashcardServices: FlashcardsService,
    private themeService: ThemeService,
    private categoryService: CategoryService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadCategories(); // Cargar categorías al iniciar
    this.isLoggedIn = this.authService.isAuthenticated();
    this.themeService.getTheme().subscribe((isLight) => {
      this.isLightTheme = isLight;
    });
  }

  // Cargar categorías existentes
  loadCategories(): void {
    this.categoryService.getCategories().subscribe(
      (categories: any[]) => {
        this.categories = categories; // Asigna las categorías obtenidas
        console.log('Categories loaded:', this.categories); // Depuración

        // Cargar flashcards para cada categoría
        this.categories.forEach((category) => {
          this.categoryService.getFlashcardsByCategory(category.category_name).subscribe(
            (flashcards: any[]) => {
              this.flashcardsByCategory[category.category_name] = flashcards; // Agrupar flashcards por categoría
              console.log(`Flashcards for ${category.category_name}:`, flashcards); // Depuración
            },
            (error) => {
              console.error(`Error fetching flashcards for ${category.category_name}:`, error); // Manejo de errores
            }
          );
        });
      },
      (error) => {
        console.error('Error fetching categories:', error); // Manejo de errores
      }
    );
  }

  // Cargar flashcards de la categoría seleccionada
  loadFlashcardsByCategory(categoryName: string): void {
    this.categoryService.getFlashcardsByCategory(categoryName).subscribe(
      (data: any[]) => {
        this.flashcards = data; // Asigna las flashcards obtenidas
        console.log('Flashcards loaded:', this.flashcards); // Depuración: Verificar las flashcards cargadas
      },
      (error) => {
        console.error('Error fetching flashcards:', error); // Manejo de errores
      }
    );
  }

  // Manejar la selección de una categoría
  onCategorySelect(categoryName: string): void {
    console.log('Selected categoryName:', categoryName); // Depuración
    if (!categoryName) {
      console.error('categoryId is undefined or null');
      return;
    }
    this.selectedCategory = categoryName.toString(); // Actualiza la categoría seleccionada
    this.loadFlashcardsByCategory(categoryName); // Carga las flashcards de la categoría seleccionada
  }

  deleteCategory(category: any): void {
    if (confirm(`Are you sure you want to delete the category "${category.category_name}"?`)) {
      this.categoryService.deleteCategory(category.category_name).subscribe({
        next: () => {
          // Elimina la categoría de la lista local
          this.categories = this.categories.filter(cat => cat.category_name !== category.category_name);

          // También elimina las flashcards asociadas a la categoría
          delete this.flashcardsByCategory[category.category_name];

          console.log(`Category "${category.category_name}" deleted successfully.`);
        },
        error: (err) => {
          console.error('Error deleting category:', err);
          alert('Failed to delete the category. Please try again.');
        }
      });
    }
  }

  // Alternar el tema
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  // Restablecer la categoría seleccionada y limpiar las flashcards
  resetCategory(): void {
    this.selectedCategory = null; // Restablece la categoría seleccionada
    this.flashcards = []; // Limpia la lista de flashcards
  }
}
