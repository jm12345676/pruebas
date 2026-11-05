import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Crearalumnos } from './crearalumnos';

describe('Crearalumnos', () => {
  let component: Crearalumnos;
  let fixture: ComponentFixture<Crearalumnos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Crearalumnos],
    }).compileComponents();

    fixture = TestBed.createComponent(Crearalumnos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
