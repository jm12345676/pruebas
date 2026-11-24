import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Editarnivel } from './editarnivel';

describe('Editarnivel', () => {
  let component: Editarnivel;
  let fixture: ComponentFixture<Editarnivel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Editarnivel],
    }).compileComponents();

    fixture = TestBed.createComponent(Editarnivel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
