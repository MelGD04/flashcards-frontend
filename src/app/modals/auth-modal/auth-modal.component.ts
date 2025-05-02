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
  

  constructor(private themeService: ThemeService, private authService: AuthService) { }

  showToast(message: string, title: string = 'Notification') {
    const toastElement = this.loginToastEl.nativeElement;
    const toast = new bootstrap.Toast(toastElement);

    // Actualizar el contenido del toast
    const toastTitle = toastElement.querySelector('#toastTitle');
    const toastMessage = toastElement.querySelector('#toastMessage');
    if (toastTitle) toastTitle.textContent = title;
    if (toastMessage) toastMessage.textContent = message;

    // Mostrar el toast
    toast.show();
  }
  
  ngOnInit() {
    // Escucha los cambios en el tema
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

  // Para el login
  usernameLogin: string = '';
  passwordLogin: string = '';



  onLogin() {
    this.authService.login(this.usernameLogin, this.passwordLogin).subscribe({
      next: (res) => {
        console.log('Login exitoso:', res);
        localStorage.setItem('access_token', res.tokens.access);
        localStorage.setItem('refresh_token', res.tokens.refresh);

        this.showToast('Login successfully! Welcome back!', 'Success');
        
      },
      error: (err) => {
        console.error('Error en login', err);
        this.showToast('Login failed! Please try again.', 'Error');
      }
    });
  }



  // Para el signup
  full_name: string = '';
  usernameSignUp: string = '';
  email: string = '';
  passwordSignUp: string = '';
  errorMessage: string = '';

  onSignup() {
    // Validar el nombre completo
    this.authService.validateName(this.full_name).subscribe({
      next: (res) => {
        const { name: first_name, last_name } = res; // Extraer first_name y last_name del backend

        // Llamar al endpoint de registro con los datos procesados
        this.authService.signup(first_name, last_name, this.usernameSignUp, this.email, this.passwordSignUp).subscribe({
          next: (response) => {
            console.log('User registered successfully:', response);
            // Mostrar notificación de éxito
            this.showToast('Signup successful! Welcome!', 'Success');
          },
          error: (error) => {
            console.error('Error during signup:', error);
            // Mostrar notificación de error
            this.showToast('Signup failed! Please try again.', 'Error');
          },
        });
      },
      error: (err) => {
        console.error('Error during name validation:', err);
        // Mostrar notificación de error
        this.showToast('Name validation failed! Please try again.', 'Error');
      },
    });
  }

  onLogout(): void {
    this.authService.logout();
    window.location.href = '';
  }
}
