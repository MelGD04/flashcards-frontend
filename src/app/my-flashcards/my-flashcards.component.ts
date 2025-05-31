import { CategoryService } from './../services/category.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FlashcardsService } from './../services/flashcards.service';
import { ThemeService } from '../services/theme.service';


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

  constructor(
    private flashcardServices: FlashcardsService,
    private themeService: ThemeService,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.loadCategories(); // Cargar categorías al iniciar
    this.themeService.getTheme().subscribe((isLight) => {
      this.isLightTheme = isLight;
    });
  }

  // Cargar categorías existentes
  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      }
    });
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
