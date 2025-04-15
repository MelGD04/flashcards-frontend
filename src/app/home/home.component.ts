import { ThemeService } from './../services/theme.service';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FlashcardsService } from '../services/flashcards.service';
import { Flashcard } from '../models/flashcard.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [
    RouterModule,
    CommonModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  flashcards: any[] = [];
  progressPercentage = 0;
  isLightTheme = true;

  constructor(private flashcardService:FlashcardsService, private themeService:ThemeService){}

  ngOnInit() {
    this.flashcardService.getFlashcards().subscribe((data) => {
      this.flashcards = data;
    });
    this.progressPercentage = this.flashcards.length > 0 ? 100 : 0;

    this.themeService.getTheme().subscribe((isLight) => {
      this.isLightTheme = isLight;
    });
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  cards = [
    {
      id: '1',
      icon: 'fas fa-user-graduate',
      title: 'For All Students',
      info: 'Create and customize your own flashcards for any subject.'
    },
    {
      id: '2',
      icon: 'fas fa-brain',
      title: 'Fast Memory',
      info: "Flashcards help you remember key information faster"
    },
    {
      id: '3',
      icon: 'fas fa-laptop',
      title: 'Access Anywhere',
      info: 'Use the flashcards on your phone, tablet, or computer.'
    }
  ]

}
