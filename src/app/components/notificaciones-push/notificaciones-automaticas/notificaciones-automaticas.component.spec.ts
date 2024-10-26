import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificacionesAutomaticasComponent } from './notificaciones-automaticas.component';

describe('NotificacionesAutomaticasComponent', () => {
  let component: NotificacionesAutomaticasComponent;
  let fixture: ComponentFixture<NotificacionesAutomaticasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificacionesAutomaticasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificacionesAutomaticasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
