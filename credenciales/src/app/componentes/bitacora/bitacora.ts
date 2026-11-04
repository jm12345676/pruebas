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
    { id: 2, fechaHora: '13/5/26 5:30', usuario: 'Brandon', matricula: '67890', nombreCompleto: 'Santiago Hernández García' },
    { id: 3, fechaHora: '13/5/26 5:30', usuario: 'Brandon', matricula: '43512', nombreCompleto: 'María Fernanda García Martínez' },
    { id: 4, fechaHora: '13/5/26 5:30', usuario: 'Brandon', matricula: '12367', nombreCompleto: 'Ximena Rodríguez Sánchez' },
    { id: 5, fechaHora: '13/5/26 5:30', usuario: 'Brandon', matricula: '32143', nombreCompleto: 'Leonardo Rodríguez Sánchez' },
    { id: 6, fechaHora: '13/5/26 5:30', usuario: 'Brandon', matricula: '86731', nombreCompleto: 'Renata Pérez Sánchez' },
    { id: 7, fechaHora: '13/5/26 5:30', usuario: 'Brandon', matricula: '13208', nombreCompleto: 'Daniel Pérez Sánchez' },
    { id: 8, fechaHora: '13/5/26 5:30', usuario: 'Brandon', matricula: '09678', nombreCompleto: 'Valeria González Rodríguez' },
    { id: 9, fechaHora: '13/5/26 5:30', usuario: 'Brandon', matricula: '86756', nombreCompleto: 'Sebastián González Pérez' },
    { id: 10, fechaHora: '13/5/26 5:30', usuario: 'Brandon', matricula: '12345', nombreCompleto: 'Sofía Hernández García' },
    { id: 11, fechaHora: '13/5/26 5:30', usuario: 'Brandon', matricula: '67890', nombreCompleto: 'Santiago Hernández García' },
    { id: 12, fechaHora: '13/5/26 5:30', usuario: 'Brandon', matricula: '43512', nombreCompleto: 'María Fernanda García Martínez' }
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