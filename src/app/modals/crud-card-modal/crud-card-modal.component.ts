import { Component } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-crud-card-modal',
  imports: [CommonModule],
  templateUrl: './crud-card-modal.component.html',
  styleUrl: './crud-card-modal.component.css'
})
export class CrudCardModalComponent {

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
