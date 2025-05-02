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
        window.location.href = '';
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
    this.authService.validateName(this.full_name).subscribe({
      next: (res) => {
        const name = res.name;
        const last_name = res.last_name;

        this.authService.signup(name, last_name, this.usernameSignUp, this.email, this.passwordSignUp).subscribe({
          next: (res) => {
            console.log('✅ Registro exitoso:', res);
            localStorage.setItem('access_token', res.tokens.access);
            localStorage.setItem('refresh_token', res.tokens.refresh);
          },
          error: (err) => {
            console.error('❌ Error en registro:', err);
          }
        });
      },
      error: (err) => {
        console.error('❌ Error en validación de nombre:', err);
      }
    });
  }

  onLogout(): void {
    this.authService.logout();
    window.location.href = '';
  }
}
