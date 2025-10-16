import { AuthService } from './../services/auth.service';
import { Component, effect, HostListener, Inject, inject, OnInit, PLATFORM_ID, Renderer2, signal } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ThemeService } from '../services/theme.service';
import { AddCardModalComponent } from '../modals/add-card-modal/add-card-modal.component'
import { AuthModalComponent } from '../modals/auth-modal/auth-modal.component';
import { UserModalComponent } from "../modals/user-modal/user-modal.component";



@Component({
  selector: 'app-nav-bar',
  imports: [
    RouterModule,
    RouterOutlet,
    CommonModule,
    AddCardModalComponent,
    AuthModalComponent,
    UserModalComponent
],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit {
  isLightTheme = true;
  isLoggedIn: boolean = false;
  userInitial: string = '';
  userBgColor: string = '';

  constructor(private themeService: ThemeService, private authService: AuthService) { }

  ngOnInit() {
    // Escucha los cambios en el tema
    this.themeService.getTheme().subscribe((isLight) => {
      this.isLightTheme = isLight;
    });
    this.isLoggedIn = this.authService.isAuthenticated();
    this.loadCurrentUser();
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  loadCurrentUser(): void {
    if (!this.authService.isAuthenticated()) {
      console.warn('User is not authenticated. Skipping request.');
      return;
    }

    this.authService.getCurrentUser().subscribe(
      (data) => {
        const username = data.username;
        this.userInitial = username.charAt(0).toUpperCase();
        this.userBgColor = this.getRandomColor();
      },
      (error) => {
        console.error('Error fetching current user:', error);
      }
    );
  }

  getRandomColor(): string {
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#F3FF33', '#FF33A8'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

}
