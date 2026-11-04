import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Alumno {
  matricula: string;
  nombre: string;
  nivel: string;
  status: 'Activo' | 'Pendiente' | 'Baja';
}

@Component({
  selector: 'app-gestion-credenciales',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './gestion-credenciales.html',
  styleUrl: './gestion-credenciales.css',
})
export class GestionCredenciales {
  alumnos: Alumno[] = [
    { matricula: '970103035', nombre: 'AGUILAR MONTOYA VICTOR HUGO',
      nivel: 'Lic. en Contaduría Pública', status: 'Activo' },
    { matricula: '201510101270', nombre: 'ALONSO MÉNDEZ VÍCTOR MANUEL',
      nivel: 'Lic. en Ciencias de la Comunicación', status: 'Pendiente' },
    { matricula: '201810171303', nombre: 'ANGEL MÁRQUEZ VERÓNICA',
      nivel: 'Lic. en Psicología', status: 'Baja' },
  ];

  filtro = '';

  get alumnosFiltrados() {
    const f = this.filtro.toLowerCase();
    return this.alumnos.filter(a =>
      a.nombre.toLowerCase().includes(f) || a.matricula.includes(f));
  }

  mostrarModalAgregar = false;
  mostrarModalNiveles = false;
  mostrarModalBitacora = false;

  toggleModalAgregar()  { this.mostrarModalAgregar  = !this.mostrarModalAgregar; }
  toggleModalNiveles()  { this.mostrarModalNiveles  = !this.mostrarModalNiveles; }
  toggleModalBitacora() { this.mostrarModalBitacora = !this.mostrarModalBitacora; }

  nuevo: Alumno = this.alumnoVacio();

  private alumnoVacio(): Alumno {
    return { matricula: '', nombre: '', nivel: '', status: 'Activo' };
  }

  guardar() {
    if (!this.nuevo.matricula || !this.nuevo.nombre) return;
    this.alumnos.push({ ...this.nuevo });
    this.nuevo = this.alumnoVacio();
    this.toggleModalAgregar();
  }

  eliminar(matricula: string) {
    this.alumnos = this.alumnos.filter(a => a.matricula !== matricula);
  }

  claseBadge(status: string) {
    const mapa: Record<string, string> = {
      Activo: 'badge-activo',
      Pendiente: 'badge-pendiente',
      Baja: 'badge-baja',
    };
    return mapa[status] ?? '';
  }

  claseOjo(status: string) {
    return 'ver-' + status.toLowerCase();
  }
}