import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-credenciales',
  standalone: true,
  imports: [],
  templateUrl: './credenciales.html',
  styleUrl: './credenciales.css'
})
export class CredencialesComponent {
  // Estado reactivo con Signals
  fotoTrasera = signal<string>('/img/gddghdhtdhyt.png');
  fotoAlumno = signal<string>('/img/group 1959');
  mostrarFormatos = signal<boolean>(false);
  mostrarAlerta = signal<boolean>(false);

  // Funciones de actualización
  toggleFormatos(): void {
    this.mostrarFormatos.update(val => !val);
  }

  abrirAlerta(): void {
    this.mostrarAlerta.set(true);
  }

  cerrarAlerta(): void {
    this.mostrarAlerta.set(false);
  }
}