import { Component, effect, HostListener, Inject, inject, OnInit, PLATFORM_ID, Renderer2, signal } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AddFlashcardModalComponent } from "../modals/add-flashcard-modal/add-flashcard-modal.component";
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ThemeService } from '../services/theme.service';


@Component({
  selector: 'app-nav-bar',
  imports: [
    RouterModule,
    RouterOutlet,
    AddFlashcardModalComponent,
    CommonModule
  ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
  isLightTheme = true;

  constructor(private themeService: ThemeService) { }

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
