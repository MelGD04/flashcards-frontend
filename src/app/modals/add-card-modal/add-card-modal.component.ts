import { Component } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-card-modal',
  imports: [CommonModule],
  templateUrl: './add-card-modal.component.html',
  styleUrl: './add-card-modal.component.css'
})
export class AddCardModalComponent {
  isLightTheme = true;

  constructor(private themeService: ThemeService) {

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
