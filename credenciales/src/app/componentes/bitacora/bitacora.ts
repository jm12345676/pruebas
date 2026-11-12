import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface RegistroBitacora {
  id: number;
  fechaHora: string;
  usuario: string;
  matricula: string;
  nombreCompleto: string;
}

@Component({
  selector: 'app-bitacora',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './bitacora.html',
  styleUrl: './bitacora.css'
})
export class BitacoraComponent {

  registros = signal<RegistroBitacora[]>([
    { id: 1, fechaHora: '13/5/26 5:30', usuario: 'Brandon', matricula: '12345', nombreCompleto: 'HERNÁNDEZ GARCÍA SOFÍA' },
  ]);

  filtro = signal('');
  mostrarConfirmacion = signal(false);

  alBuscar(event: Event): void {
    this.filtro.set((event.target as HTMLInputElement).value);
  }

  borrarRegistro(id: number): void {
    this.registros.update(actuales => actuales.filter(reg => reg.id !== id));
  }

  toggleConfirmacion(): void {
    this.mostrarConfirmacion.update(v => !v);
  }

  borrarTodos(): void {
    this.registros.set([]);
    this.mostrarConfirmacion.set(false);
  }
}