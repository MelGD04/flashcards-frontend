import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-modal',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.css']
})
export class UserModalComponent {
  isLightTheme = true;
  username: string | null = null;
  isLoading: boolean = false;
  userData = { username: '' };
  passwordData = { current_password: '', new_password: '', confirm_password: '' };
  isEditingUsername = false;
  originalUsername: string | null = null;

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

  updateUser(): void {
    const userData = {
      username: this.userData.username,
      current_password: this.passwordData.current_password // Obligatorio según el serializer
    };

    this.authService.updateUser(userData).subscribe({
      next: (response) => {
        console.log('User updated successfully:', response);
        alert('Username updated successfully!');
      },
      error: (error) => {
        console.error('Error updating username:', error);
        alert('Failed to update username. Please try again.');
      }
    });
  }

  updatePassword(): void {
    if (this.passwordData.new_password !== this.passwordData.confirm_password) {
      alert('Passwords do not match!');
      return;
    }

    const passwordUpdateData = {
      username: this.username || '', // Incluye el username si es necesario
      current_password: this.passwordData.current_password,
      new_password: this.passwordData.new_password,
      new_password_confirm: this.passwordData.confirm_password
    };

    this.authService.updateUser(passwordUpdateData).subscribe({
      next: (response) => {
        console.log('Password updated successfully:', response);
        alert('Password updated successfully!');
      },
      error: (error) => {
        console.error('Error updating password:', error);
        alert('Failed to update password. Please try again.');
      }
    });
  }

  saveChanges(): void {
    const userData = {
      username: this.userData.username,
      current_password: this.passwordData.current_password,
      new_password: this.passwordData.new_password,
      new_password_confirm: this.passwordData.confirm_password
    };

    this.authService.updateUser(userData).subscribe({
      next: (response) => {
        console.log('Changes saved successfully:', response);
        alert('Changes saved successfully!');
      },
      error: (error) => {
        console.error('Error saving changes:', error);
        alert('Failed to save changes. Please try again.');
      }
    });
  }

  cancelEditUsername(): void {
    this.isEditingUsername = false; // Salir del modo de edición
    this.userData.username = this.originalUsername ?? ''; // Restaurar el valor original del username
    this.passwordData.current_password = ''; // Limpiar el campo de contraseña
  }

  toggleEditUsername(): void {
    if (!this.isEditingUsername) {
      this.originalUsername = this.userData.username; // Guardar el valor original del username
    }
    this.isEditingUsername = !this.isEditingUsername;
  }

  private handleError(error: any, defaultMessage: string): void {
    console.error(defaultMessage, error);
    const message = error?.error?.message || defaultMessage;
    // Aquí podrías mostrar un mensaje al usuario si es necesario
  }
}
