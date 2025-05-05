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
  newFlashcard = { question: '', answer: '', difficulty: 'easy', category: '' }; // Datos para crear una nueva tarjeta
  isLightTheme = true;

  constructor(private themeService: ThemeService, private flashcardsService: FlashcardsService) {

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

 

}
