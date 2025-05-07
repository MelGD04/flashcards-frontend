import { FormsModule } from '@angular/forms';
import { FlashcardsComponent } from './../../flashcards/flashcards.component';
import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { CommonModule } from '@angular/common';
import { FlashcardsService } from '../../services/flashcards.service';
import { CategoryService } from '../../services/category.service';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-add-card-modal',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './add-card-modal.component.html',
  styleUrls: ['./add-card-modal.component.css']
})
export class AddCardModalComponent implements OnInit {
  isLightTheme = true;
  flashcards: any[] = []; // Lista de tarjetas
  newFlashcard = { question: '', answer: '', difficulty: 'easy', category: '' }; // Datos para crear una nueva tarjeta
  categories: any[] = []; // Lista de categorías existentes
  newCategoryName: string = ''; // Nombre de la nueva categoría
  selectedCategory: string | null = null; // Categoría seleccionada

  constructor(
    private themeService: ThemeService,
    private flashcardsService: FlashcardsService,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.loadCategories(); // Cargar categorías al iniciar  
    // Escucha los cambios en el tema
    this.themeService.getTheme().subscribe((isLight) => {
      this.isLightTheme = isLight;
    });
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  // Crear una nueva tarjeta
  createFlashcard(): void {
    this.flashcardsService.createFlashcard(this.newFlashcard).subscribe(
      (data) => {
        console.log('Flashcard created:', data);
        this.flashcards.push(data); // Agregar la nueva tarjeta a la lista
        this.newFlashcard = { question: '', answer: '', difficulty: 'easy', category: '' }; // Reiniciar el formulario
      },
      (error) => {
        console.error('Error creating flashcard:', error);
      }
    );
  }

  // Cargar categorías existentes
  loadCategories(): void {
    const token = localStorage.getItem('access_token'); // Obtén el token del almacenamiento local
    if (!token) {
      console.error('No access token found. User is not authenticated.');
      return;
    }

    this.categoryService.getCategories().subscribe(
      (data) => {
        this.categories = data;
        console.log('Categories loaded:', this.categories); // Verificar las categorías cargadas
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );
  }

  // Agregar una nueva categoría
  addCategory(): void {
    if (!this.newCategoryName.trim()) {
      console.error('Category name cannot be empty.');
      return;
    }

    const token = localStorage.getItem('access_token'); // Verificar si el token está disponible
    if (!token) {
      console.error('No access token found. User is not authenticated.');
      return;
    }

    this.categoryService.createCategory(this.newCategoryName).subscribe(
      (data) => {
        console.log('Category added:', data);
        this.categories.push(data); // Agregar la nueva categoría a la lista
        this.newFlashcard.category = data.category_name; // Seleccionar la nueva categoría
        this.newCategoryName = ''; // Limpiar el campo de entrada
      },
      (error) => {
        console.error('Error adding category:', error);
      }
    );
  }
}
