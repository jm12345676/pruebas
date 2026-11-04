import { Component } from '@angular/core';

@Component({
  selector: 'app-credenciales',
  templateUrl: './credenciales.html',
  styleUrls: ['./credenciales.css']
})
export class Credenciales {
  // Controlan la visibilidad de los elementos dinámicos de las vistas
  mostrarFormatos: boolean = false;
  mostrarAlerta: boolean = false;

  // Alterna la caja central de selección de formatos al hacer clic
  toggleFormatos() {
    this.mostrarFormatos = !this.mostrarFormatos;
  }

  // Funciones para abrir y cerrar el modal de advertencia
  abrirAlerta() {
    this.mostrarAlerta = true;
  }

  cerrarAlerta() {
    this.mostrarAlerta = false;
  }
}