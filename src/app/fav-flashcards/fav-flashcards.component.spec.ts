import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavFlashcardsComponent } from './fav-flashcards.component';

describe('FavFlashcardsComponent', () => {
  let component: FavFlashcardsComponent;
  let fixture: ComponentFixture<FavFlashcardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavFlashcardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FavFlashcardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
