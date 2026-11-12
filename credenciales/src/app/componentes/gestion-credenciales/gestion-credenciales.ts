import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

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
  constructor(private rourter: Router) {}

  VerDetalle(alumno: any) {
    this.rourter.navigate(
      ['/credencial', alumno.matricula],
      {
        state: { alumno: alumno }
      }
    );
  }

  alumnos: Alumno[] = [
    { matricula: '20260303567', apellidoPaterno: 'Salvador', apellidoMaterno: 'Montolla',
      nombres: 'Victor Hugo', telefonoEmergencia: '', escuela: '',
      nivel: 'Lic. en Contaduría Pública', vigencia: '', foto: null, status: 'Activo' },
    { matricula: '20151010127', apellidoPaterno: 'Comi', apellidoMaterno: 'ALba',
      nombres: 'Ester', telefonoEmergencia: '', escuela: '',
      nivel: 'Lic. en Ciencias de la Comunicación', vigencia: '', foto: null, status: 'Pendiente' },
    { matricula: '20181017130', apellidoPaterno: 'Torres', apellidoMaterno: 'Perez',
      nombres: 'Victoria Emilia', telefonoEmergencia: '', escuela: '',
      nivel: 'Lic. en Psicología', vigencia: '', foto: null, status: 'Baja' },
  ];

  filtro = '';

get alumnosFiltrados() {
  const f = this.filtro.toLowerCase().trim();

  return this.alumnos.filter(a => {
    const nombre = this.nombreCompleto(a).toLowerCase();
    const matricula = a.matricula.toLowerCase();

    const palabras = nombre.split(' ');

    const coincideNombre = palabras.some(palabra =>
      palabra.startsWith(f)
    );

    const coincideIniciales = palabras
      .map(palabra => palabra[0])
      .join('')
      .includes(f.replace(/\s/g, ''));

    return nombre.includes(f) ||
           matricula.includes(f) ||
           coincideNombre ||
           coincideIniciales;
  });
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