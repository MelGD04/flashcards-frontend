import { provideClientHydration } from '@angular/platform-browser';
import { FlashcardsComponent } from './../flashcards/flashcards.component';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Flashcard } from '../models/flashcard.model';
import { FlashcardsService } from '../services/flashcards.service';
import { ThemeService } from '../services/theme.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-fav-flashcards',
  imports: [
    CommonModule
  ],
  templateUrl: './fav-flashcards.component.html',
  styleUrl: './fav-flashcards.component.css'
})
export class FavFlashcardsComponent implements OnInit{
  //Esto es de Dani
  favoriteFlashcards: Flashcard[] = [];
  isLightTheme = true;

  constructor(private flashcardServices: FlashcardsService, private themeService: ThemeService){}

  ngOnInit(): void {
    this.favoriteFlashcards = this.flashcardServices.getFlashcardByFavorite(true);

    this.themeService.getTheme().subscribe((isLight) => {
      this.isLightTheme = isLight;
    });
  }

  @Input() card!: Flashcard;
  @Output() flipCardEvent = new EventEmitter<Flashcard>();

  flipCard() {
    this.flipCardEvent.emit(this.card);
  }
  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
