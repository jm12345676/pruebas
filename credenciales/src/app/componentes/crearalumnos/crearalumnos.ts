export class Crearalumnos {}

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

  nuevo: Alumno = {
    matricula: '', apellidoPaterno: '', apellidoMaterno: '', nombres: '',
    telefonoEmergencia: '', escuela: '', nivel: '', vigencia: '',
    foto: null, status: 'Activo',
  };

  guardar() {
    if (!this.nuevo.matricula || !this.nuevo.nombres || !this.nuevo.apellidoPaterno) return;
    console.log('Alumno guardado:', this.nuevo);
    // Más adelante aquí se enviará a un servicio o a la base de datos
    this.router.navigate(['/inicio']);
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
}
