import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedallaComponent } from './medalla.component';

describe('MedallaComponent', () => {
  let component: MedallaComponent;
  let fixture: ComponentFixture<MedallaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedallaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedallaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
