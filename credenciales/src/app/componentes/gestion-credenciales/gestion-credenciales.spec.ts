import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GestionCredenciales } from './gestion-credenciales';

describe('GestionCredenciales', () => {
  let component: GestionCredenciales;
  let fixture: ComponentFixture<GestionCredenciales>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionCredenciales],
    }).compileComponents();

    fixture = TestBed.createComponent(GestionCredenciales);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
