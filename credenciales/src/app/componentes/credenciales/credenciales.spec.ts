import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Credenciales } from './credenciales';

describe('Credenciales', () => {
  let component: Credenciales;
  let fixture: ComponentFixture<Credenciales>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Credenciales],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(Credenciales);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debe iniciar con mostrarFormatos y mostrarAlerta en false', () => {
    expect(component.mostrarFormatos()).toBe(false);
    expect(component.mostrarAlerta()).toBe(false);
  });
});