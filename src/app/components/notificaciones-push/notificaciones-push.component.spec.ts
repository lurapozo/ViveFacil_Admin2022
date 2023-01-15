import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificacionesPushComponent } from './notificaciones-push.component';

describe('NotificacionesPushComponent', () => {
  let component: NotificacionesPushComponent;
  let fixture: ComponentFixture<NotificacionesPushComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificacionesPushComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificacionesPushComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
