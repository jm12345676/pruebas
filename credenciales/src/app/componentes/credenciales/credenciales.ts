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
  fotoAlumno = signal<string>('/img/Pocoyo_opagangan (1).webp');
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