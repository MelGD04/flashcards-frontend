import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudCardModalComponent } from './crud-card-modal.component';

describe('CrudCardModalComponent', () => {
  let component: CrudCardModalComponent;
  let fixture: ComponentFixture<CrudCardModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrudCardModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrudCardModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
