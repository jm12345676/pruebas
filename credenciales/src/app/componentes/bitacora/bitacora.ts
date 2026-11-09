import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

// Interfaz para tipar cada registro de la bitácora
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
  // Lista inicial de registros obtenida directamente de la imagen
  registros = signal<RegistroBitacora[]>([
    { id: 1, fechaHora: '13/5/26 5:30', usuario: 'Brandon', matricula: '12345', nombreCompleto: 'Sofía Hernández García' },
  ]);

  // Elimina un solo registro por ID
  borrarRegistro(id: number): void {
    this.registros.update(actuales => actuales.filter(reg => reg.id !== id));
  }

  // Borra absolutamente todos los registros de la lista
  borrarTodos(): void {
    if (confirm('¿Estás seguro de que deseas borrar todos los registros de la bitácora?')) {
      this.registros.set([]);
    }
  }
}