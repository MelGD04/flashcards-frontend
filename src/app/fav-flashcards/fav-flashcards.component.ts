import { provideClientHydration } from '@angular/platform-browser';
import { FlashcardsComponent } from './../flashcards/flashcards.component';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FlashcardsService } from '../services/flashcards.service';
import { ThemeService } from '../services/theme.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-fav-flashcards',
  imports: [
    CommonModule
  ],
  templateUrl: './fav-flashcards.component.html',
  styleUrl: './fav-flashcards.component.css'
})
export class FavFlashcardsComponent implements OnInit{
  favoriteCards: any[] = []; // Lista de tarjetas favoritas
  isLightTheme = true;
  isLoggedIn: boolean = false;

  constructor(
    private flashcardService: FlashcardsService, 
    private themeService: ThemeService,
    private authService: AuthService
  ){}

  ngOnInit(): void {
    this.loadFavoriteCards();
    this.isLoggedIn = this.authService.isAuthenticated();
    this.themeService.getTheme().subscribe((isLight) => {
      this.isLightTheme = isLight;
    });
  }

  loadFavoriteCards(): void {
    this.flashcardService.getFavoriteCards().subscribe(
      (data) => {
        console.log('Favorite cards:', data);
        this.favoriteCards = data;
      },
      (error) => {
        console.error('Error fetching favorite cards:', error);
      }
    );
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
