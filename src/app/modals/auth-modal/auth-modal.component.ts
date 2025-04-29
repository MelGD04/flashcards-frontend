import { Component } from '@angular/core';
import { FormBuilder, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../services/auth.service';
import bootstrap from '../../../main.server';

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
  showPassword: boolean = false;
  isLightTheme = true;

  constructor(private themeService: ThemeService, private authService: AuthService) {}

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

  // Para el signup
  full_name: string = '';
  usernameSignUp: string = '';
  email: string = '';
  passwordSignUp: string = '';
  errorMessage: string = '';


  onLogin() {
    this.authService.login(this.usernameLogin, this.passwordLogin).subscribe({
      next: (res) => {
        console.log('Login exitoso:', res);
        localStorage.setItem('access_token', res.tokens.access);
        localStorage.setItem('refresh_token', res.tokens.refresh);
      },
      error: (err) => {
        console.error('Error en login', err);
      }
    });
  }

  onSignup() {
    if (!this.full_name || !this.usernameSignUp || !this.email || !this.passwordSignUp) {
      this.errorMessage = 'Por favor completa todos los campos.';
      return;
    }

    this.authService.signup(this.full_name, this.usernameSignUp, this.email, this.passwordSignUp)
      .subscribe({
        next: (res) => {
          console.log('Registro exitoso:', res);
        },
        error: (err) => {
          console.error('Error en el registro:', err);
          this.errorMessage = err.error?.message || 'Error desconocido durante el registro.';
        }
      });
  }

  validateFullName() {
    this.authService.validateFullName(this.full_name).subscribe(
      response => {
        console.log('Validación exitosa:', response);
      },
      error => {
        console.error('Error al validar nombre completo:', error);
      }
    );
  }

}
