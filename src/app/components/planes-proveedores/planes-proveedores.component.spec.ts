import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanesProveedoresComponent } from './planes-proveedores.component';

describe('PlanesProveedoresComponent', () => {
  let component: PlanesProveedoresComponent;
  let fixture: ComponentFixture<PlanesProveedoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanesProveedoresComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanesProveedoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
