import { AuthService } from './../services/auth.service';
import { Component, effect, HostListener, Inject, inject, OnInit, PLATFORM_ID, Renderer2, signal } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ThemeService } from '../services/theme.service';
import { AddCardModalComponent } from '../modals/add-card-modal/add-card-modal.component'
import { AuthModalComponent } from '../modals/auth-modal/auth-modal.component';



@Component({
  selector: 'app-nav-bar',
  imports: [
    RouterModule,
    RouterOutlet,
    CommonModule,
    AddCardModalComponent,
    AuthModalComponent
],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit {
  isLightTheme = true;
  isLoggedIn: boolean = false;

  constructor(private themeService: ThemeService, private authService: AuthService) { }

  ngOnInit() {
    // Escucha los cambios en el tema
    this.themeService.getTheme().subscribe((isLight) => {
      this.isLightTheme = isLight;
    });
    this.isLoggedIn = this.authService.isAuthenticated();
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

}
