import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-modal',
  imports: [
    CommonModule
  ],
  templateUrl: './user-modal.component.html',
  styleUrl: './user-modal.component.css'
})
export class UserModalComponent {
  isLightTheme = true;
  username: string | null = null;
  isLoading: boolean = false;

  constructor(private themeService: ThemeService, private authService: AuthService) { }

  ngOnInit() {
    this.loadCurrentUser();
    this.subscribeToThemeChanges();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  loadCurrentUser(): void {
    if (!this.authService.isAuthenticated()) {
      console.warn('User is not authenticated. Skipping request.');
      return;
    }

    this.isLoading = true;
    this.authService.getCurrentUser().subscribe(
      (data) => {
        this.username = data.username;
      },
      (error) => {
        this.handleError(error, 'Error fetching current user.');
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  private subscribeToThemeChanges(): void {
    this.themeService.getTheme().subscribe((isLight) => {
      this.isLightTheme = isLight;
    });
  }

  private handleError(error: any, defaultMessage: string): void {
    console.error(defaultMessage, error);
    const message = error?.error?.message || defaultMessage;
    // Aquí podrías mostrar un mensaje al usuario si es necesario
  }
}
