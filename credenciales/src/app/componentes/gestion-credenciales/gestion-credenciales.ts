
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import diccionario from '../../diccionario/diccionario.json';

interface Alumno {
  matricula: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  nombres: string;
  telefonoEmergencia: string;
  escuela: string;
  nivel: string;
  vigencia: string;
  foto: string | null;
  status: 'Activo' | 'Pendiente' | 'Baja';
  fechaBaja?: string;
  motivoBaja?: string;
}

@Component({
  selector: 'app-gestion-credenciales',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './gestion-credenciales.html',
  styleUrl: './gestion-credenciales.css',
})
export class GestionCredenciales {

  // Datos provenientes del archivo diccionario.json
  alumnosDiccionario = diccionario.alumno;

  // Lista que alimenta la tabla
  alumnos: Alumno[] = [];

  constructor(private router: Router) {
    const guardado = localStorage.getItem('alumnos');

    if (guardado) {
      this.alumnos = JSON.parse(guardado);
    } else {
      this.cargarAlumnosDiccionario();
    }
  }

  // ---------- CARGAR ALUMNOS DEL JSON ----------

  cargarAlumnosDiccionario() {
    this.alumnos = this.alumnosDiccionario.map(a => ({
      matricula: a.matricula,
      apellidoPaterno: '',
      apellidoMaterno: '',
      nombres: a.nombre,
      telefonoEmergencia: '',
      escuela: '',
      nivel: a.carrera,
      vigencia: '',
      foto: null,
      status: 'Activo'
    }));

    this.guardarLocal();
  }

  // ---------- VER DETALLE ----------

  VerDetalle(alumno: Alumno) {
    this.router.navigate(
      ['/credencial', alumno.matricula],
      {
        state: { alumno: alumno }
      }
    );
  }

  // ---------- EDITAR ----------

  editar(alumno: Alumno) {
    this.router.navigate(['/editaralumno', alumno.matricula]);
  }

  // ---------- BUSCADOR ----------

  filtro = '';

  get alumnosFiltrados() {
    const f = this.filtro.toLowerCase().trim();
    const consultaIniciales = f.replace(/\s/g, '');

    return this.alumnos.filter(a => {

      if (
        this.filtroStatus !== 'Todos' &&
        a.status !== this.filtroStatus
      ) {
        return false;
      }

      const nombre = this.nombreCompleto(a).toLowerCase();
      const matricula = a.matricula.toLowerCase();

      const palabras = nombre.split(/\s+/).filter(Boolean);

      const coincideNombre = palabras.some(palabra =>
        palabra.startsWith(f)
      );

      const iniciales = palabras
        .map(palabra => palabra[0])
        .join('');

      const coincideIniciales = iniciales.includes(consultaIniciales);

      if (!f) {
        return true;
      }

      return nombre.includes(f) ||
        matricula.includes(f) ||
        coincideNombre ||
        coincideIniciales;
    });
  }

  nombreCompleto(a: Alumno) {
    return `${a.apellidoPaterno} ${a.apellidoMaterno} ${a.nombres}`
      .trim()
      .replace(/\s+/g, ' ');
  }

  // ---------- AGREGAR ALUMNOS ----------

  mostrarModalAgregar = false;

  toggleModalAgregar() {
    this.mostrarModalAgregar = !this.mostrarModalAgregar;
  }

  nuevo: Alumno = this.alumnoVacio();

  private alumnoVacio(): Alumno {
    return {
      matricula: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      nombres: '',
      telefonoEmergencia: '',
      escuela: '',
      nivel: '',
      vigencia: '',
      foto: null,
      status: 'Activo',
    };
  }

  guardar() {
    if (
      !this.nuevo.matricula ||
      !this.nuevo.nombres ||
      !this.nuevo.apellidoPaterno
    ) {
      alert('Completa los campos obligatorios');
      return;
    }

    const existe = this.alumnos.some(
      a => a.matricula === this.nuevo.matricula
    );

    if (existe) {
      alert('Ya existe un alumno con esa matrícula');
      return;
    }

    this.alumnos.push({ ...this.nuevo });

    this.guardarLocal();

    this.nuevo = this.alumnoVacio();
    this.toggleModalAgregar();
  }

  // ---------- ELIMINAR ----------

  eliminar(matricula: string) {
    this.alumnos = this.alumnos.filter(
      a => a.matricula !== matricula
    );

    this.guardarLocal();
  }

  // ---------- FILTRO POR ESTATUS ----------

  estados = ['Todos', 'Activo', 'Pendiente', 'Baja'] as const;

  filtroStatus: 'Todos' | 'Activo' | 'Pendiente' | 'Baja' = 'Todos';

  motivos = [
    'Baja voluntaria',
    'Baja académica',
    'Falta de pago',
    'Cambio de escuela',
    'Otro',
  ];

  // ---------- CONTROL DE BAJAS ----------

  alumnoBaja: Alumno | null = null;

  motivoBaja = '';

  get totalBajas() {
    return this.alumnos.filter(
      a => a.status === 'Baja'
    ).length;
  }

  abrirBaja(alumno: Alumno) {
    this.alumnoBaja = alumno;
    this.motivoBaja = '';
  }

  cerrarBaja() {
    this.alumnoBaja = null;
  }

  confirmarBaja() {
    if (!this.alumnoBaja || !this.motivoBaja) {
      return;
    }

    this.alumnoBaja.status = 'Baja';
    this.alumnoBaja.motivoBaja = this.motivoBaja;

    this.alumnoBaja.fechaBaja = new Date()
      .toISOString()
      .slice(0, 10);

    this.guardarLocal();
    this.cerrarBaja();
  }

  reactivar(alumno: Alumno) {
    alumno.status = 'Activo';
    alumno.motivoBaja = undefined;
    alumno.fechaBaja = undefined;

    this.guardarLocal();
  }

  // ---------- GUARDAR EN LOCALSTORAGE ----------

  private guardarLocal() {
    localStorage.setItem(
      'alumnos',
      JSON.stringify(this.alumnos)
    );
  }

  // ---------- GENERAR CREDENCIAL ----------

  generarCredencial() {
    console.log('Generar credencial de:', this.nuevo);
  }

  // ---------- FOTOGRAFÍAS ----------

  seleccionarFoto(event: Event) {
    const input = event.target as HTMLInputElement;
    const archivo = input.files?.[0];

    if (!archivo) {
      return;
    }

    const lector = new FileReader();

    lector.onload = () => {
      this.nuevo.foto = lector.result as string;
    };

    lector.readAsDataURL(archivo);
  }

  quitarFoto() {
    this.nuevo.foto = null;
  }

  // ---------- CLASES VISUALES ----------

  claseBadge(status: string) {
    const mapa: Record<string, string> = {
      Activo: 'badge-activo',
      Pendiente: 'badge-pendiente',
      Baja: 'badge-baja',
    };

    return mapa[status] ?? '';
  }

  claseOjo(status: string) {
    return 'ver-' + status.toLowerCase();
  }
}
