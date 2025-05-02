import { provideClientHydration } from '@angular/platform-browser';
import { FlashcardsComponent } from './../flashcards/flashcards.component';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  isLightTheme = true;

  constructor(private flashcardServices: FlashcardsService, private themeService: ThemeService){}

  ngOnInit(): void {
    this.themeService.getTheme().subscribe((isLight) => {
      this.isLightTheme = isLight;
    });
  }
  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
