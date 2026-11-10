import { Component, inject } from '@angular/core';
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
  selector: 'app-crearalumnos',
  imports: [FormsModule, RouterLink],
  templateUrl: './crearalumnos.html',
  styleUrl: './crearalumnos.css',
})
export class CrearAlumno {
  private router = inject(Router);

  escuelas = [
    'Ives',
    'Matri',
  ];

  niveles = [
    'Maestría en Pedagogía',
    'Licenciatura en Contaduría Pública',
    'Licenciatura en Psicología',
  ];

  arrastrando = false;

  nuevo: Alumno = {
    matricula: '', apellidoPaterno: '', apellidoMaterno: '', nombres: '',
    telefonoEmergencia: '', escuela: '', nivel: '', vigencia: '',
    foto: null, status: 'Activo',
  };

  guardar() {
    if (!this.nuevo.matricula || !this.nuevo.nombres || !this.nuevo.apellidoPaterno) return;
    console.log('Alumno guardado:', this.nuevo);
    this.router.navigate(['/inicio']);
  }

  generarCredencial() {
    console.log('Generar credencial de:', this.nuevo);
  }

  // ---------- Foto ----------
  seleccionarFoto(event: Event) {
    const input = event.target as HTMLInputElement;
    const archivo = input.files?.[0];
    if (archivo) this.leerArchivo(archivo);
    input.value = ''; // permite volver a elegir la misma imagen
  }

  quitarFoto() {
    this.nuevo.foto = null;
  }

  // ---------- Arrastrar y soltar ----------
  alArrastrar(event: DragEvent) {
    event.preventDefault();
    this.arrastrando = true;
  }

  alSalir(event: DragEvent) {
    event.preventDefault();
    this.arrastrando = false;
  }

  alSoltar(event: DragEvent) {
    event.preventDefault();
    this.arrastrando = false;
    const archivo = event.dataTransfer?.files?.[0];
    if (archivo) this.leerArchivo(archivo);
  }

  private leerArchivo(archivo: File) {
  if (!['image/jpeg', 'image/png'].includes(archivo.type)) return;

  // Libera la foto anterior de la memoria
  if (this.nuevo.foto) URL.revokeObjectURL(this.nuevo.foto);

  this.nuevo.foto = URL.createObjectURL(archivo);
  }
}