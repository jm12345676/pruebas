import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface Nivel {
  nombre: string;
  abreviatura: string;
  rvoe: string;
  tipoRvoe: string;
}

@Component({
  selector: 'app-niveles',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './niveles.html',
  styleUrl: './niveles.css',
})
export class Niveles {

  niveles: Nivel[] = [
    { nombre: 'Maestría En Docencia De La Lengua Inglesa', abreviatura: 'MDLI', rvoe: '', tipoRvoe: '' },
    { nombre: 'Maestría en Pedagogía', abreviatura: 'MEP', rvoe: '', tipoRvoe: '' },
    { nombre: 'Maestría En Docencia De La Lengua Inglesa', abreviatura: 'MDLI', rvoe: '', tipoRvoe: '' },
    { nombre: 'Maestría en Pedagogía', abreviatura: 'MEP', rvoe: '', tipoRvoe: '' },
  ];

  mostrarModalAgregar = false;
  editando: Nivel | null = null;      // null = creando, objeto = editando
  nuevoNivel: Nivel = this.nivelVacio();

  nivelVacio(): Nivel {
    return { nombre: '', abreviatura: '', rvoe: '', tipoRvoe: '' };
  }

  crearNivel() {
    this.editando = null;
    this.nuevoNivel = this.nivelVacio();
    this.mostrarModalAgregar = true;
  }

  editar(nivel: Nivel) {
    this.editando = nivel;
    this.nuevoNivel = { ...nivel };   // copia, no toca la tabla hasta guardar
    this.mostrarModalAgregar = true;
  }

  cerrarModal() {
    this.mostrarModalAgregar = false;
  }

  guardarNivel() {
    if (
      !this.nuevoNivel.nombre.trim() ||
      !this.nuevoNivel.abreviatura.trim() ||
      !this.nuevoNivel.rvoe.trim() ||
      !this.nuevoNivel.tipoRvoe.trim()
    ) {
      alert('Completa todos los campos');
      return;
    }

    if (this.editando) {
      Object.assign(this.editando, this.nuevoNivel);
    } else {
      this.niveles.push({ ...this.nuevoNivel });
    }

    this.nuevoNivel = this.nivelVacio();
    this.editando = null;
    this.mostrarModalAgregar = false;
  }
}