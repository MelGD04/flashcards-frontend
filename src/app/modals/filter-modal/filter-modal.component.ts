import { Component } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-filter-modal',
  imports: [CommonModule],
  templateUrl: './filter-modal.component.html',
  styleUrl: './filter-modal.component.css'
})
export class FilterModalComponent {
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
