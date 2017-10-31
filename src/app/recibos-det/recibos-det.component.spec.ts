import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecibosDetComponent } from './recibos-det.component';

describe('RecibosDetComponent', () => {
  let component: RecibosDetComponent;
  let fixture: ComponentFixture<RecibosDetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecibosDetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecibosDetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
