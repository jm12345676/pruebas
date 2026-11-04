import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface Alumno {
  matricula: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  nombres: string;
  telefonoEmergencia: string;
  escuela: string;
  nivel: string;
  vigencia: string;
  foto: string | null;
  status: 'Activo' | 'Pendiente' | 'Baja';
}

@Component({
  selector: 'app-gestion-credenciales',
  imports: [FormsModule, RouterLink],
  templateUrl: './gestion-credenciales.html',
  styleUrl: './gestion-credenciales.css',
})
export class GestionCredenciales {
  alumnos: Alumno[] = [
    { matricula: '970103035', apellidoPaterno: 'AGUILAR', apellidoMaterno: 'MONTOYA',
      nombres: 'VICTOR HUGO', telefonoEmergencia: '', escuela: '',
      nivel: 'Lic. en Contaduría Pública', vigencia: '', foto: null, status: 'Activo' },
    { matricula: '201510101270', apellidoPaterno: 'ALONSO', apellidoMaterno: 'MÉNDEZ',
      nombres: 'VÍCTOR MANUEL', telefonoEmergencia: '', escuela: '',
      nivel: 'Lic. en Ciencias de la Comunicación', vigencia: '', foto: null, status: 'Pendiente' },
    { matricula: '201810171303', apellidoPaterno: 'ANGEL', apellidoMaterno: 'MÁRQUEZ',
      nombres: 'VERÓNICA', telefonoEmergencia: '', escuela: '',
      nivel: 'Lic. en Psicología', vigencia: '', foto: null, status: 'Baja' },
  ];

  filtro = '';

  get alumnosFiltrados() {
    const f = this.filtro.toLowerCase();
    return this.alumnos.filter(a =>
      this.nombreCompleto(a).toLowerCase().includes(f) || a.matricula.includes(f));
  }

  nombreCompleto(a: Alumno) {
    return `${a.apellidoPaterno} ${a.apellidoMaterno} ${a.nombres}`.trim();
  }

  mostrarModalAgregar = false;

  toggleModalAgregar() {
    this.mostrarModalAgregar = !this.mostrarModalAgregar;
  }

  nuevo: Alumno = this.alumnoVacio();

  private alumnoVacio(): Alumno {
    return {
      matricula: '', apellidoPaterno: '', apellidoMaterno: '', nombres: '',
      telefonoEmergencia: '', escuela: '', nivel: '', vigencia: '',
      foto: null, status: 'Activo',
    };
  }

  guardar() {
    if (!this.nuevo.matricula || !this.nuevo.nombres || !this.nuevo.apellidoPaterno) return;
    this.alumnos.push({ ...this.nuevo });
    this.nuevo = this.alumnoVacio();
    this.toggleModalAgregar();
  }

  eliminar(matricula: string) {
    this.alumnos = this.alumnos.filter(a => a.matricula !== matricula);
  }

  generarCredencial() {
    console.log('Generar credencial de:', this.nuevo);
  }

  seleccionarFoto(event: Event) {
    const input = event.target as HTMLInputElement;
    const archivo = input.files?.[0];
    if (!archivo) return;

    const lector = new FileReader();
    lector.onload = () => (this.nuevo.foto = lector.result as string);
    lector.readAsDataURL(archivo);
  }

  quitarFoto() {
    this.nuevo.foto = null;
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