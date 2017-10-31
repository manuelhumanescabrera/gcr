import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeticionesComponent } from './peticiones.component';

describe('PeticionesComponent', () => {
  let component: PeticionesComponent;
  let fixture: ComponentFixture<PeticionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeticionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeticionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
