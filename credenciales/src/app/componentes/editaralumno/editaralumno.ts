import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';

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
  fechaBaja?: string;
  motivoBaja?: string;
}

@Component({
  selector: 'app-editaralumno',
  imports: [FormsModule, RouterLink],
  templateUrl: './editaralumno.html',
  styleUrl: './editaralumno.css',
})
export class EditarAlumno implements OnInit {

  private router = inject(Router);
  private route = inject(ActivatedRoute);

  alumnos: Alumno[] = [];

  nuevo: Alumno | null = null;

  escuelas = [
    'Ives',
    'Matri',
  ];

  niveles = [
    'Maestría en Pedagogía',
    'Licenciatura en Contaduría Pública',
    'Licenciatura en Psicología',
  ];

  ngOnInit() {

    // Recuperar alumnos guardados
    const guardado = localStorage.getItem('alumnos');

    this.alumnos = guardado ? JSON.parse(guardado) : [];

    // Obtener la matrícula de la URL
    const matricula = this.route.snapshot.paramMap.get('matricula');

    // Buscar al alumno correspondiente
    const alumno = this.alumnos.find(
      a => a.matricula === matricula
    );

    if (!alumno) {
      alert('No se encontró el alumno');
      this.router.navigate(['/inicio']);
      return;
    }

    // Copiar los datos para editarlos
    this.nuevo = { ...alumno };
  }

  guardar() {

    if (!this.nuevo) return;

    if (
      !this.nuevo.matricula ||
      !this.nuevo.nombres ||
      !this.nuevo.apellidoPaterno
    ) {
      alert('Completa los campos obligatorios');
      return;
    }

    // Buscar la posición del alumno que estamos editando
    const indice = this.alumnos.findIndex(
      a => a.matricula === this.nuevo!.matricula
    );

    if (indice === -1) {
      alert('No se encontró el alumno');
      return;
    }

    // Actualizar los datos del alumno
    this.alumnos[indice] = { ...this.nuevo };

    // Guardar los cambios
    localStorage.setItem('alumnos', JSON.stringify(this.alumnos));

    alert('Alumno actualizado correctamente');

    // Regresar a gestión de credenciales
    this.router.navigate(['/inicio']);
  }

  seleccionarFoto(event: Event) {

    const input = event.target as HTMLInputElement;
    const archivo = input.files?.[0];

    if (!archivo || !this.nuevo) return;

    if (!['image/jpeg', 'image/png'].includes(archivo.type)) {
      alert('Solo se permiten imágenes JPG y PNG');
      return;
    }

    const lector = new FileReader();

    lector.onload = () => {
      if (this.nuevo) {
        this.nuevo.foto = lector.result as string;
      }
    };

    lector.readAsDataURL(archivo);
    input.value = '';
  }

  quitarFoto() {
    if (this.nuevo) {
      this.nuevo.foto = null;
    }
  }
}
