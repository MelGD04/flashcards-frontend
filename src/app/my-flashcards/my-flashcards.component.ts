import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FlashcardsService } from './../services/flashcards.service';
import { Flashcard } from '../models/flashcard.model';
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
  /* 
  categories: string[] = [];
  flashcardsByCategory: { [key: string]: Flashcard[] } = {};
  selectedCategory: string | null = null; // Para saber cuál categoría está seleccionada
  selectedFlashcards: Flashcard[] = []; // Guarda las flashcards de la categoría seleccionada
  isLightTheme = true;

  constructor(private flashcardServices: FlashcardsService, private themeService: ThemeService) { }

  //to esta talla tambien es de Dani
  ngOnInit(): void {
    this.categories = this.flashcardServices.getCategories();
    this.categories.forEach((category) => {
      this.flashcardsByCategory[category] = this.flashcardServices.getFlashcardsByCategory(category);
    });
    this.themeService.getTheme().subscribe((isLight) => {
      this.isLightTheme = isLight;
    });
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
    this.selectedFlashcards = this.flashcardsByCategory[category];
  }

  // Método para volver al listado de categorías
  resetCategory() {
    this.selectedCategory = null;
    this.selectedFlashcards = [];
  }
  
  isDarkMode = false;

  toggleTheme() {
    this.themeService.toggleTheme();
  }
    */
}
