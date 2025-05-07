import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
declare var bootstrap: any;

@Component({
  selector: 'app-auth-modal',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './auth-modal.component.html',
  styleUrl: './auth-modal.component.css'
})
export class AuthModalComponent {
  @ViewChild('loginToast', { static: true }) loginToastEl!: ElementRef;
  showPassword: boolean = false;
  isLightTheme = true;
  isLoading: boolean = false;

  // Login
  usernameLogin: string = '';
  passwordLogin: string = '';

  // Signup
  full_name: string = '';
  usernameSignUp: string = '';
  email: string = '';
  passwordSignUp: string = '';
  errorMessage: string = '';

  constructor(private themeService: ThemeService, private authService: AuthService) { }

  ngOnInit() {
    this.themeService.getTheme().subscribe((isLight) => {
      this.isLightTheme = isLight;
    });
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  showToast(message: string, title: string = 'Notification') {
    const toastElement = this.loginToastEl.nativeElement;
    const toast = new bootstrap.Toast(toastElement);

    const toastTitle = toastElement.querySelector('#toastTitle');
    const toastMessage = toastElement.querySelector('#toastMessage');
    if (toastTitle) toastTitle.textContent = title;
    if (toastMessage) toastMessage.textContent = message;

    toast.show();
  }

  private handleError(error: any, defaultMessage: string): void {
    console.error(defaultMessage, error);
    const message = error?.error?.message || defaultMessage;
    this.showToast(message, 'Error');
  }

  private validateSignupData(): boolean {
    if (!this.full_name || !this.usernameSignUp || !this.email || !this.passwordSignUp) {
      this.showToast('All fields are required for signup.', 'Error');
      return false;
    }
    return true;
  }

  onLogin() {
    this.isLoading = true;
    this.authService.login(this.usernameLogin, this.passwordLogin).subscribe({
      next: (res) => {
        console.log('Login exitoso:', res);
        localStorage.setItem('access_token', res.tokens.access);
        localStorage.setItem('refresh_token', res.tokens.refresh);
        this.showToast('Login successfully! Welcome back!', 'Success');
        location.href = ''; 
      },
      error: (err) => {
        this.handleError(err, 'Login failed! Please try again.');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  onSignup() {
    if (!this.validateSignupData()) return;

    this.isLoading = true;
    this.authService.validateName(this.full_name).subscribe({
      next: (res) => {
        const { name: first_name, last_name } = res;

        this.authService.signup(first_name, last_name, this.usernameSignUp, this.email, this.passwordSignUp).subscribe({
          next: (response) => {
            console.log('User registered successfully:', response);
            this.showToast('Signup successful! Welcome!', 'Success');
            location.href = '';
          },
          error: (error) => {
            this.handleError(error, 'Signup failed! Please try again.');
          },
          complete: () => {
            this.isLoading = false;
          }
        });
      },
      error: (err) => {
        this.handleError(err, 'Name validation failed! Please try again.');
        this.isLoading = false;
      }
    });
  }

  onLogout(): void {
    this.authService.logout();
    this.showToast('You have been logged out.', 'Success');
    location.href = '';
  }

  deleteAccount(): void {
    this.isLoading = true;
    this.authService.deleteAuthenticatedUser().subscribe({
      next: (response) => {
        console.log('User deleted successfully:', response);
        this.showToast('Your account has been deleted successfully.', 'Success');
        this.authService.logout();
        location.href = '';
      },
      error: (error) => {
        this.handleError(error, 'An error occurred while deleting your account. Please try again.');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
