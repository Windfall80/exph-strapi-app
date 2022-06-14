import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidenciaDetallesComponent } from './incidencia-detalles.component';

describe('IncidenciaDetallesComponent', () => {
  let component: IncidenciaDetallesComponent;
  let fixture: ComponentFixture<IncidenciaDetallesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidenciaDetallesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidenciaDetallesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
