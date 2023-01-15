import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SugerenciasLeidasComponent } from './sugerencias-leidas.component';

describe('SugerenciasLeidasComponent', () => {
  let component: SugerenciasLeidasComponent;
  let fixture: ComponentFixture<SugerenciasLeidasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SugerenciasLeidasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SugerenciasLeidasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
