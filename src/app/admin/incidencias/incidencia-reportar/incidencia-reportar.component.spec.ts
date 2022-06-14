import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidenciaReportarComponent } from './incidencia-reportar.component';

describe('IncidenciaReportarComponent', () => {
  let component: IncidenciaReportarComponent;
  let fixture: ComponentFixture<IncidenciaReportarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidenciaReportarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidenciaReportarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
