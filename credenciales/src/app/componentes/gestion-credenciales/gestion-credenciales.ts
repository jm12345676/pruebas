import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import diccionario from '../../diccionario/diccionario.json';

export interface Alumno {
  matricula: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  nombres: string;
  telefonoEmergencia: string;
  escuela: string;
  nivel: string;
  vigencia: string;
  foto: string | null;
  status: 'Activo' | 'Baja';
  fechaBaja?: string;
  motivoBaja?: string;
}

type FiltroStatus = 'Todos' | 'Activo' | 'Baja';

@Component({
  selector: 'app-gestion-credenciales',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './gestion-credenciales.html',
  styleUrl: './gestion-credenciales.css'
})
export class GestionCredenciales implements OnInit {
  private readonly STORAGE_KEY = 'alumnos';

  // Datos
  listaAlumno: Alumno[] = [];

  // Buscador y filtros (los usa el HTML)
  filtro = '';
  filtroStatus: FiltroStatus = 'Todos';
  estados: FiltroStatus[] = ['Todos', 'Activo', 'Baja'];

  // Modal de baja (los usa el HTML)
  alumnoBaja: Alumno | null = null;
  motivoBaja = '';
  motivos: string[] = [
    'Baja voluntaria',
    'Baja académica',
    'Baja administrativa',
    'Cambio de escuela',
    'Otro'
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.listaAlumno = this.cargarAlumno();
  }

  // ---------- Carga y guardado ----------
  private cargarAlumno(): Alumno[] {
    if (typeof localStorage !== 'undefined') {
      const guardado = localStorage.getItem(this.STORAGE_KEY);
      if (guardado) {
        try {
          return JSON.parse(guardado);
        } catch {
          console.warn('No se pudo leer localStorage, se usará el diccionario.');
        }
      }
    }

    // Funciona si el JSON es una lista directa o si tiene la clave "alumno"
    const datos: any = diccionario;
    const lista: any[] = Array.isArray(datos) ? datos : datos.alumno;

    const alumnoInicial: Alumno[] = lista.map((registro): Alumno => ({
      matricula: registro.matricula,
      apellidoPaterno: '',
      apellidoMaterno: '',
      nombres: registro.nombre,
      telefonoEmergencia: '',
      escuela: registro.carrera,
      nivel: '',
      vigencia: '',
      foto: null,
      status: 'Activo'
    }));

    // Se guarda desde el inicio para que Editar y Credencial lo encuentren
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(alumnoInicial));
    }
    return alumnoInicial;
  }

  private guardarAlumno(): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.listaAlumno));
  }

  // ---------- Tabla ----------
  get alumnosFiltrados(): Alumno[] {
    const texto = this.filtro.trim().toLowerCase();

    return this.listaAlumno.filter(a => {
      const coincideTexto =
        !texto ||
        this.nombreCompleto(a).toLowerCase().includes(texto) ||
        a.matricula.includes(texto);
      const coincideStatus =
        this.filtroStatus === 'Todos' || a.status === this.filtroStatus;
      return coincideTexto && coincideStatus;
    });
  }

  nombreCompleto(a: Alumno): string {
    return `${a.nombres} ${a.apellidoPaterno} ${a.apellidoMaterno}`
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Ajusta estos nombres a las clases que tengas en tu CSS
  claseBadge(status: string): string {
    switch (status) {
      case 'Activo':    return 'badge-activo';
      case 'Pendiente': return 'badge-pendiente';
      case 'Baja':      return 'badge-baja';
      default:          return '';
    }
  }

  // ---------- Acciones ----------
  VerDetalle(a: Alumno): void {
    this.router.navigate(['/credencial', a.matricula]);
  }

  editar(a: Alumno): void {
    this.router.navigate(['/editaralumno', a.matricula]);
  }

  abrirBaja(a: Alumno): void {
    this.alumnoBaja = a;
    this.motivoBaja = '';
  }

  cerrarBaja(): void {
    this.alumnoBaja = null;
    this.motivoBaja = '';
  }

  confirmarBaja(): void {
    if (!this.alumnoBaja || !this.motivoBaja) return;

    const matricula = this.alumnoBaja.matricula;
    this.listaAlumno = this.listaAlumno.map(a =>
      a.matricula === matricula
        ? {
            ...a,
            status: 'Baja' as const,
            motivoBaja: this.motivoBaja,
            fechaBaja: new Date().toLocaleDateString('es-MX')
          }
        : a
    );
    this.guardarAlumno();
    this.cerrarBaja();
  }

  reactivar(a: Alumno): void {
    this.listaAlumno = this.listaAlumno.map(x =>
      x.matricula === a.matricula
        ? { ...x, status: 'Activo' as const, fechaBaja: undefined, motivoBaja: undefined }
        : x
    );
    this.guardarAlumno();
  }
}