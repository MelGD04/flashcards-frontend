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
export class MyFlashcardsComponent {
  categories: any[] = []; // Lista de categorías existentes
  newCategoryName: string = ''; // Nombre de la nueva categoría
  selectedCategory: string | null = null; // Categoría seleccionada

  constructor(private flashcardServices: FlashcardsService, private themeService: ThemeService, private categoryService: CategoryService) { }
  // Cargar categorías existentes
  loadCategories(): void {
    const token = localStorage.getItem('access_token'); // Obtén el token del almacenamiento local
    if (!token) {
      console.error('No access token found. User is not authenticated.');
      return;
    }

    // Llamada al servicio para obtener las categorías
    this.categoryService.getCategories().subscribe(
      (data: any[]) => {
        this.categories = data; // Asigna las categorías obtenidas
        console.log('Categories loaded:', this.categories); // Depuración: Verificar las categorías cargadas
      },
      (error) => {
        console.error('Error fetching categories:', error); // Manejo de errores
      }
    );
  }

  isLightTheme = true;



  //to esta talla tambien es de Dani
  ngOnInit(): void {
    this.loadCategories(); // Cargar categorías al iniciar
    this.themeService.getTheme().subscribe((isLight) => {
      this.isLightTheme = isLight;
    });
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
