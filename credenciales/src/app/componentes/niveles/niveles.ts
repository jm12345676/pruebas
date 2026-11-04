
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

// ESTRUCTURA DE UN NIVEL
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

  // LISTA DE NIVELES
  niveles: Nivel[] = [
    {
      nombre: 'Maestría En Docencia De La Lengua Inglesa',
      abreviatura: 'MDLI',
      rvoe: '',
      tipoRvoe: ''
    },
    {
      nombre: 'Maestría en Pedagogía',
      abreviatura: 'MEP',
      rvoe: '',
      tipoRvoe: ''
    },
    {
      nombre: 'Maestría En Docencia De La Lengua Inglesa',
      abreviatura: 'MDLI',
      rvoe: '',
      tipoRvoe: ''
    },
    {
      nombre: 'Maestría en Pedagogía',
      abreviatura: 'MEP',
      rvoe: '',
      tipoRvoe: ''
    },
  ];

  // CONTROL DEL MODAL
  mostrarModalAgregar = false;

  // DATOS DEL NUEVO NIVEL
  nuevoNivel: Nivel = this.nivelVacio();

  // CREAR NIVEL: ABRIR MODAL
  crearNivel() {
    this.nuevoNivel = this.nivelVacio();
    this.mostrarModalAgregar = true;
  }

  // CERRAR MODAL
  cerrarModal() {
    this.mostrarModalAgregar = false;
  }

  // CREAR UN OBJETO VACÍO
  nivelVacio(): Nivel {
    return {
      nombre: '',
      abreviatura: '',
      rvoe: '',
      tipoRvoe: ''
    };
  }

  // GUARDAR NIVEL
  guardarNivel() {

    // Comprobar que los campos estén llenos
    if (
      !this.nuevoNivel.nombre.trim() ||
      !this.nuevoNivel.abreviatura.trim() ||
      !this.nuevoNivel.rvoe.trim() ||
      !this.nuevoNivel.tipoRvoe.trim()
    ) {
      alert('Completa todos los campos');
      return;
    }

    // Agregar el nuevo nivel a la lista
    this.niveles.push({ ...this.nuevoNivel });

    // Limpiar los campos
    this.nuevoNivel = this.nivelVacio();

    // Cerrar el modal
    this.mostrarModalAgregar = false;

  }

  // EDITAR NIVEL
  editar(nivel: Nivel) {
    console.log('Editar', nivel);
  }

}
