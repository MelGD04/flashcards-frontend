import { Component, ViewChild } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

declare const bootstrap: any;

@Component({
  selector: 'app-add-flashcard-modal',
  imports: [
    CommonModule
  ],
  templateUrl: './add-flashcard-modal.component.html',
  styleUrl: './add-flashcard-modal.component.css'
})
export class AddFlashcardModalComponent {

  showPassword: boolean = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  isLightTheme = true;

  constructor(private themeService: ThemeService,  private authService: AuthService, private fb: FormBuilder) { 
  
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
  
}
