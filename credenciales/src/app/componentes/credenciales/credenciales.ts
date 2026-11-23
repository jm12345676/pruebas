import { Component, ElementRef, OnInit, ViewChild, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface Alumno {
  foto: string;
  nombre: string;
  matricula: string;
  carrera: string;
  rvoe: string;
  vigencia: string;
}

export interface FormatoCredencial {
  id: string;
  nombre: string;
  frente: string;
  esPersonalizado?: boolean;
}

@Component({
  selector: 'app-credenciales',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './credenciales.html',
  styleUrl: './credenciales.css'
})
export class Credenciales implements OnInit {
  @ViewChild('areaImpresion') areaImpresion!: ElementRef<HTMLElement>;

  readonly codigoBarras = '/img/uwu.png';
  readonly fondoReverso = '/img/Group%202030.png';
  private readonly STORAGE_KEY = 'ives_formatos_credenciales';

  formatos = signal<FormatoCredencial[]>([
    {
      id: 'diseno-1',
      nombre: 'Diseño 1',
      frente: '/img/Group%202029.png'
    },
    {
      id: 'diseno-2',
      nombre: 'Diseño 2',
      frente: '/img/Group%201959.png'
    }
  ]);

  formatoActivoId = signal<string>('diseno-1');
  fondoFrente = '/img/Group%202029.png';

  // Detecta si el formato seleccionado es personalizado (para mostrar el botón de Editar)
  formatoActivoEsPersonalizado = computed(() => {
    const actual = this.formatos().find(f => f.id === this.formatoActivoId());
    return !!actual?.esPersonalizado;
  });

  // Estados para crear / editar formato
  editandoFormatoId = signal<string | null>(null);
  nuevoNombreFormato = signal<string>('');
  nuevoFrenteBase64 = signal<string>('');
  nombreArchivoFrente = signal<string>('');
  arrastrandoSobreFrente = signal<boolean>(false);
  errorFormularioFormato = signal<string>('');

  alumno = signal<Alumno>({
    foto: '',
    nombre: 'MARIO ALBERTO PÉREZ GÓMEZ',
    matricula: '20260303567',
    carrera: 'Contaduría Pública',
    rvoe: 'ES183/2004',
    vigencia: 'AGO 2027'
  });

  panelActivo = signal<'NINGUNO' | 'VIGENCIA' | 'FORMATOS' | 'AGREGAR_FORMATO'>('NINGUNO');
  mostrarAlerta = signal<boolean>(false);
  tipoCodigo = signal<'BARRAS' | 'QR'>('BARRAS');

  ngOnInit(): void {
    this.cargarFormatosGuardados();
  }

  private cargarFormatosGuardados(): void {
    try {
      const guardados = localStorage.getItem(this.STORAGE_KEY);
      if (guardados) {
        const personalizados: FormatoCredencial[] = JSON.parse(guardados);
        this.formatos.update(base => [...base, ...personalizados]);
      }
    } catch (e) {
      console.error('Error al cargar formatos guardados:', e);
    }
  }

  togglePanel(panel: 'VIGENCIA' | 'FORMATOS' | 'AGREGAR_FORMATO'): void {
    this.errorFormularioFormato.set('');

    if (panel === 'AGREGAR_FORMATO') {
      if (this.panelActivo() === 'AGREGAR_FORMATO') {
        this.cerrarFormularioFormato();
      } else {
        this.editandoFormatoId.set(null);
        this.nuevoNombreFormato.set('');
        this.nuevoFrenteBase64.set('');
        this.nombreArchivoFrente.set('');
        this.panelActivo.set('AGREGAR_FORMATO');
      }
      return;
    }

    // Si estaba abierto el formulario de agregar/editar y cambia a otro panel, restaura la vista previa
    if (this.panelActivo() === 'AGREGAR_FORMATO') {
      this.restaurarVistaPreviaActual();
    }

    this.panelActivo.update(actual => (actual === panel ? 'NINGUNO' : panel));
  }

  iniciarEdicionFormatoActivo(): void {
    const actual = this.formatos().find(f => f.id === this.formatoActivoId());
    if (!actual || !actual.esPersonalizado) return;

    this.editandoFormatoId.set(actual.id);
    this.nuevoNombreFormato.set(actual.nombre);
    this.nuevoFrenteBase64.set(actual.frente);
    this.nombreArchivoFrente.set('Imagen actual guardada');
    this.errorFormularioFormato.set('');
    this.panelActivo.set('AGREGAR_FORMATO');
  }

  actualizarVigencia(nuevaVigencia: string): void {
    const valor = nuevaVigencia.trim().toUpperCase();
    if (valor) {
      this.alumno.update(actual => ({ ...actual, vigencia: valor }));
    }
    this.panelActivo.set('NINGUNO');
  }

  seleccionarFormato(formato: FormatoCredencial): void {
    this.formatoActivoId.set(formato.id);
    this.fondoFrente = formato.frente;
    // Si es un formato base (Diseño 1 o 2), cerramos el panel; si es personalizado lo dejamos abierto por si quiere darle a "Editar"
    if (!formato.esPersonalizado) {
      this.panelActivo.set('NINGUNO');
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.arrastrandoSobreFrente.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.arrastrandoSobreFrente.set(false);
  }

  onDropArchivo(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.arrastrandoSobreFrente.set(false);

    const file = event.dataTransfer?.files?.[0];
    if (file && file.type.startsWith('image/')) {
      this.procesarImagen(file);
    }
  }

  onArchivoSeleccionado(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.procesarImagen(file);
    input.value = '';
  }

  private procesarImagen(file: File): void {
    this.errorFormularioFormato.set('');
    const reader = new FileReader();
    reader.onload = () => {
      const resultado = reader.result as string;
      this.nuevoFrenteBase64.set(resultado);
      this.nombreArchivoFrente.set(file.name);
      this.fondoFrente = resultado;
    };
    reader.readAsDataURL(file);
  }

  quitarImagen(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.nuevoFrenteBase64.set('');
    this.nombreArchivoFrente.set('');
    this.restaurarVistaPreviaActual();
  }

  private restaurarVistaPreviaActual(): void {
    const formatoActual = this.formatos().find(f => f.id === this.formatoActivoId());
    this.fondoFrente = formatoActual?.frente || '/img/Group%202029.png';
  }

  cerrarFormularioFormato(): void {
    this.restaurarVistaPreviaActual();
    this.editandoFormatoId.set(null);
    this.nuevoNombreFormato.set('');
    this.nuevoFrenteBase64.set('');
    this.nombreArchivoFrente.set('');
    this.errorFormularioFormato.set('');
    this.panelActivo.set('NINGUNO');
  }

  guardarFormato(): void {
    const nombre = this.nuevoNombreFormato().trim();
    const frente = this.nuevoFrenteBase64();
    const idEnEdicion = this.editandoFormatoId();

    if (!nombre) {
      this.errorFormularioFormato.set('Ingresa un nombre para el formato.');
      return;
    }

    if (!frente) {
      this.errorFormularioFormato.set('Selecciona la imagen frontal de la credencial.');
      return;
    }

    let listaActualizada: FormatoCredencial[];
    let formatoGuardado: FormatoCredencial;

    if (idEnEdicion) {
      // Actualizar formato existente
      formatoGuardado = {
        id: idEnEdicion,
        nombre,
        frente,
        esPersonalizado: true
      };
      listaActualizada = this.formatos().map(f => (f.id === idEnEdicion ? formatoGuardado : f));
    } else {
      // Crear nuevo formato
      formatoGuardado = {
        id: 'custom-' + Date.now(),
        nombre,
        frente,
        esPersonalizado: true
      };
      listaActualizada = [...this.formatos(), formatoGuardado];
    }

    const soloPersonalizados = listaActualizada.filter(f => f.esPersonalizado);
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(soloPersonalizados));
    } catch (e) {
      this.errorFormularioFormato.set('La imagen es muy pesada para guardarse localmente.');
      return;
    }

    this.formatos.set(listaActualizada);
    this.formatoActivoId.set(formatoGuardado.id);
    this.fondoFrente = formatoGuardado.frente;

    this.editandoFormatoId.set(null);
    this.nuevoNombreFormato.set('');
    this.nuevoFrenteBase64.set('');
    this.nombreArchivoFrente.set('');
    this.errorFormularioFormato.set('');
    this.panelActivo.set('NINGUNO');
  }

  alternarCodigo(tipo?: 'BARRAS' | 'QR'): void {
    this.tipoCodigo.update(actual => tipo ?? (actual === 'BARRAS' ? 'QR' : 'BARRAS'));
  }

  onErrorImagen(event: Event): void {
    (event.target as HTMLImageElement).style.display = 'none';
  }

  imprimirCredencial(): void {
    this.panelActivo.set('NINGUNO');
    this.mostrarAlerta.set(false);

    const nodo = this.areaImpresion?.nativeElement;
    if (!nodo) return;

    const clon = nodo.cloneNode(true) as HTMLElement;
    clon.querySelectorAll('.no-print').forEach(el => el.remove());

    const estilos = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map(el => el.outerHTML)
      .join('\n');

    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;';
    document.body.appendChild(iframe);

    const doc = iframe.contentDocument ?? iframe.contentWindow?.document;
    if (!doc) {
      iframe.remove();
      return;
    }

    doc.open();
    doc.write(`
      <!doctype html>
      <html lang="es">
      <head>
        <meta charset="utf-8">
        <base href="${document.baseURI}">
        ${estilos}
        <style>
          @page {
            size: 54mm 85mm;
            margin: 0;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            box-sizing: border-box;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            width: 54mm !important;
            background: #ffffff !important;
            font-family: Arial, Helvetica, "Segoe UI", Roboto, sans-serif;
          }
          .credenciales-grid {
            display: block !important;
            width: 54mm !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .credencial-card {
            width: 54mm !important;
            height: 85mm !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
            border: 0 !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            page-break-after: always !important;
            break-after: page !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          .credencial-card:last-child {
            page-break-after: auto !important;
            break-after: auto !important;
          }
          .lienzo-credencial {
            width: 267px !important;
            height: 419px !important;
            margin: 0 !important;
            border-radius: 0 !important;
            zoom: 0.7644 !important;
          }
        </style>
      </head>
      <body>${clon.outerHTML}</body>
      </html>
    `);
    doc.close();

    const cargas = Array.from(doc.images).map(img =>
      img.complete ? Promise.resolve() : new Promise<void>(r => { img.onload = img.onerror = () => r(); })
    );

    Promise.all(cargas).then(() => {
      setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        setTimeout(() => iframe.remove(), 1000);
      }, 150);
    });
  }
}