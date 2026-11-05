import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-credenciales',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './credenciales.html',
  styleUrl: './credenciales.css'
})
export class CredencialesComponent implements OnInit {

  alumno: any = null;
  matricula = '';

  // FOTOGRAFÍA DEL ALUMNO
  imagenFrente = signal<string>('/img/Group 1959.png');
  imagenReverso = signal<string>('/img/gddghdhtdhyt.png');

  // CONTROLAR LA VENTANA DE FORMATOS
  mostrarFormatos = signal<boolean>(false);

  // CONTROLAR LA ALERTA
  mostrarAlerta = signal<boolean>(false);

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // Obtener la matrícula de la dirección
    this.matricula =
      this.route.snapshot.paramMap.get('matricula') ?? '';

    // Recibir los datos del alumno
    this.alumno = history.state.alumno ?? null;
  }

  // ABRIR Y CERRAR FORMATOS
  toggleFormatos(): void {
    this.mostrarFormatos.update(valor => !valor);
  }

  // ABRIR ALERTA
  abrirAlerta(): void {
    this.mostrarAlerta.set(true);
  }

  // CERRAR ALERTA
  cerrarAlerta(): void {
    this.mostrarAlerta.set(false);
  }
}