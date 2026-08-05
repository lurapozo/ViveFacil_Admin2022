import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificacionesProgramadasComponent } from './notificaciones-programadas.component';

describe('NotificacionesProgramadasComponent', () => {
  let component: NotificacionesProgramadasComponent;
  let fixture: ComponentFixture<NotificacionesProgramadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificacionesProgramadasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificacionesProgramadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
