import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SugerenciasNoLeidasComponent } from './sugerencias-no-leidas.component';

describe('SugerenciasNoLeidasComponent', () => {
  let component: SugerenciasNoLeidasComponent;
  let fixture: ComponentFixture<SugerenciasNoLeidasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SugerenciasNoLeidasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SugerenciasNoLeidasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
