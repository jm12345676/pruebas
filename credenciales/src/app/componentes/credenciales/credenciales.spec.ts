import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CredencialesComponent } from './credenciales';

describe('CredencialesComponent', () => {
  let component: CredencialesComponent;
  let fixture: ComponentFixture<CredencialesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CredencialesComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(CredencialesComponent);
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

  it('debe cambiar el estado de mostrarFormatos al llamar toggleFormatos()', () => {
    component.toggleFormatos();
    expect(component.mostrarFormatos()).toBe(true);
    component.toggleFormatos();
    expect(component.mostrarFormatos()).toBe(false);
  });

  it('debe abrir y cerrar la alerta correctamente', () => {
    component.abrirAlerta();
    expect(component.mostrarAlerta()).toBe(true);
    component.cerrarAlerta();
    expect(component.mostrarAlerta()).toBe(false);
  });
});