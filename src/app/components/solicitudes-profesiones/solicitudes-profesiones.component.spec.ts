import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudesProfesionesComponent } from './solicitudes-profesiones.component';

describe('SolicitudesProfesionesComponent', () => {
  let component: SolicitudesProfesionesComponent;
  let fixture: ComponentFixture<SolicitudesProfesionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolicitudesProfesionesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitudesProfesionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
