import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface Alumno {
  foto: string;
  nombre: string;
  matricula: string;
  carrera: string;
  rvoe: string;
  vigencia: string;
}

@Component({
  selector: 'app-credenciales',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './credenciales.html',
  styleUrl: './credenciales.css'
})
export class Credenciales {
  fondoFrente = '/img/Group%202029.png';
  fondoReverso = '/img/Group%202030.png';
  codigoBarras = '/img/uwu.png';

  alumno = signal<Alumno>({
    foto: '',
    nombre: 'MARIO ALBERTO PÉREZ GÓMEZ',
    matricula: '20260303567',
    carrera: 'Lic. en Contaduría Pública',
    rvoe: 'ES183/2004',
    vigencia: 'AGO 2027'
  });

  mostrarFormatos = signal<boolean>(false);
  mostrarAlerta = signal<boolean>(false);

  toggleFormatos(): void {
    this.mostrarFormatos.update(v => !v);
  }

  abrirAlerta(): void {
    this.mostrarAlerta.set(true);
  }

  cerrarAlerta(): void {
    this.mostrarAlerta.set(false);
  }

  onErrorImagen(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }
}