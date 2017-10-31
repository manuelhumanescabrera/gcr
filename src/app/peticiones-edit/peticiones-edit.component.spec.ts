import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeticionesEditComponent } from './peticiones-edit.component';

describe('PeticionesEditComponent', () => {
  let component: PeticionesEditComponent;
  let fixture: ComponentFixture<PeticionesEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeticionesEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeticionesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
