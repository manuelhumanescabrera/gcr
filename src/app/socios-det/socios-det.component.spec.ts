import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SociosDetComponent } from './socios-det.component';

describe('SociosDetComponent', () => {
  let component: SociosDetComponent;
  let fixture: ComponentFixture<SociosDetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SociosDetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SociosDetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
