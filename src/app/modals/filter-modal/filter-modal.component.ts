import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-filter-modal',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './filter-modal.component.html',
  styleUrls: ['./filter-modal.component.css']
})
export class FilterModalComponent {
  @Input() categories: any[] = []; // Lista de categorías recibida desde el componente padre
  @Output() filtersApplied = new EventEmitter<{ category: string; difficulty: string }>();

  isLightTheme = true;
  selectedCategory: string = ''; // Categoría seleccionada
  selectedDifficulty: string = ''; // Dificultad seleccionada

  constructor(private themeService: ThemeService, private categoryService: CategoryService) {
    // Cargar categorías al iniciar
    this.loadCategories();

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

  loadCategories(): void {
    this.categoryService.getCategories().subscribe(
      (categories: any[]) => {
        this.categories = categories; // Asigna las categorías obtenidas
        console.log('Categories loaded:', this.categories); // Depuración
      },
      (error) => {
        console.error('Error fetching categories:', error); // Manejo de errores
      }
    );
  }

  applyFilters(): void {
    console.log('Selected Category:', this.selectedCategory); // Depuración
    console.log('Selected Difficulty:', this.selectedDifficulty); // Depuración

    // Emitir los filtros seleccionados al componente padre
    this.filtersApplied.emit({
      category: this.selectedCategory,
      difficulty: this.selectedDifficulty
    });

   
  }
}
