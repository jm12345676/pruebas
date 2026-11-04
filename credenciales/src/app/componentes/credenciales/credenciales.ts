import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-credenciales',
  standalone: true,
  imports: [],
  templateUrl: './credenciales.html',
  styleUrl: './credenciales.css'
})

export class CredencialesComponent {

  
  // FOTOGRAFÍA DEL ALUMNO
  fotoAlumno = signal<string>('/img/foto-alumno.png');

  // IMAGEN DE LA PARTE TRASERA
  fotoTrasera = signal<string>('/img/credencial-trasera.png');

  // CONTROLAR LA VENTANA DE FORMATOS
  mostrarFormatos = signal<boolean>(false);

  // CONTROLAR LA ALERTA
  mostrarAlerta = signal<boolean>(false);


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
alumno: any = null;
  matricula = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {

    // Obtener la matrícula de la dirección
    this.matricula =
      this.route.snapshot.paramMap.get('matricula') ?? '';

    // Recibir los datos del alumno
    this.alumno = history.state.alumno ?? null;

  }

}
