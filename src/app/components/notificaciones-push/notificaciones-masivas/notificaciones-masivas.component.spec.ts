import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificacionesMasivasComponent } from './notificaciones-masivas.component';

describe('NotificacionesMasivasComponent', () => {
  let component: NotificacionesMasivasComponent;
  let fixture: ComponentFixture<NotificacionesMasivasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificacionesMasivasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificacionesMasivasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
