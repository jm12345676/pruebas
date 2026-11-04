
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CredencialesComponent } from './credenciales'; // Verifica el nombre exacto de tu clase

describe('CredencialesComponent', () => {
  let component: CredencialesComponent;
  let fixture: ComponentFixture<CredencialesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CredencialesComponent] // Al ser Standalone Component, entra directamente en imports
    }).compileComponents();

    fixture = TestBed.createComponent(CredencialesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Ejecuta la detección inicial de cambios en lugar de whenStable()
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debe iniciar con mostrarFormatos y mostrarAlerta en false', () => {
    expect(component.mostrarFormatos).toBeFalse();
    expect(component.mostrarAlerta).toBeFalse();
  });

  it('debe cambiar el estado de mostrarFormatos al llamar toggleFormatos()', () => {
    component.toggleFormatos();
    expect(component.mostrarFormatos).toBeTrue();
    component.toggleFormatos();
    expect(component.mostrarFormatos).toBeFalse();
  });

  it('debe abrir y cerrar la alerta correctamente', () => {
    component.abrirAlerta();
    expect(component.mostrarAlerta).toBeTrue();
    component.cerrarAlerta();
    expect(component.mostrarAlerta).toBeFalse();
  });
});