import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyFlashcardsComponent } from './my-flashcards.component';

describe('MyFlashcardsComponent', () => {
  let component: MyFlashcardsComponent;
  let fixture: ComponentFixture<MyFlashcardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyFlashcardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyFlashcardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
