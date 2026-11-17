import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-credenciales',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './credenciales.html',
  styleUrl: './credenciales.css'
})
export class CredencialesComponent implements OnInit {

  matricula = '';

  // DATOS DEL ESTUDIANTE USANDO SIGNALS
  estudiante = signal({
    nombre: 'MARIO ALBERTO PÉREZ GÓMEZ',
    matricula: '20240918',
    nivel: 'Licenciatura',
    rvoe: '20221456 de fecha 12/08/2022',
    vigencia: 'Ago 2024 - Jul 2025'
  });

  // FOTOGRAFÍAS Y DISEÑO
  imagenFrente = signal<string>('/img/Group 2029.png');
  imagenReverso = signal<string>('/img/Group 2030.png');
  fotografiaAlumno = signal<string>('/img/estudiante.png'); // Ajusta la ruta de la foto si es necesario

  // CONTROLADORES DE VISTA
  mostrarFormatos = signal<boolean>(false);
  mostrarAlerta = signal<boolean>(false);

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.matricula = this.route.snapshot.paramMap.get('matricula') ?? '';

    // Si pasas datos por history.state, los tomamos; si no, se queda con el valor por defecto
    const alumnoState = history.state.alumno;
    if (alumnoState) {
      this.estudiante.set({
        nombre: alumnoState.nombre ?? this.estudiante().nombre,
        matricula: alumnoState.matricula ?? this.matricula,
        nivel: alumnoState.nivel ?? this.estudiante().nivel,
        rvoe: alumnoState.rvoe ?? this.estudiante().rvoe,
        vigencia: alumnoState.vigencia ?? this.estudiante().vigencia
      });
    }
  }

  toggleFormatos(): void {
    this.mostrarFormatos.update(valor => !valor);
  }

  abrirAlerta(): void {
    this.mostrarAlerta.set(true);
  }

  cerrarAlerta(): void {
    this.mostrarAlerta.set(false);
  }
}