import { FormsModule } from '@angular/forms';
import { FlashcardsComponent } from './../../flashcards/flashcards.component';
import { Component } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { CommonModule } from '@angular/common';
import { FlashcardsService } from '../../services/flashcards.service';

@Component({
  selector: 'app-add-card-modal',
  imports: [
    CommonModule, 
    FormsModule
  ],
  templateUrl: './add-card-modal.component.html',
  styleUrl: './add-card-modal.component.css'
})
export class AddCardModalComponent {
  isLightTheme = true;
  flashcards: any[] = []; // Lista de tarjetas
  newFlashcard = { question: '', answer: '', difficulty: 'easy', category: '' }; // Datos para crear una nueva tarjeta

  constructor(private themeService: ThemeService, private flashcardsService: FlashcardsService) {
    // Constructor

  }


  ngOnInit() {
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
}
