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
  readonly firmaAutoridad = '/img/uwuowo.jpeg';
  private readonly API_URL = 'http://localhost:3001/api/formatos';

  formatos = signal<FormatoCredencial[]>([
    {
      id: 'diseno-1',
      nombre: 'Diseño 1',
      frente: '/img/Group%202029.png'
    },
    {
      id: 'diseno-2',
      nombre: 'Diseño 2',
      frente: this.crearPlantillaAlternativaLimpia()
    }
  ]);

  formatoActivoId = signal<string>('diseno-1');
  fondoFrente = '/img/Group%202029.png';

  editandoFormatoId = signal<string | null>(null);
  nuevoNombreFormato = signal<string>('');
  nuevoFrenteBase64 = signal<string>('');
  nombreArchivoFrente = signal<string>('');
  arrastrandoSobreFrente = signal<boolean>(false);
  errorFormularioFormato = signal<string>('');
  guardando = signal<boolean>(false);

  alumno = signal<Alumno>({
    foto: '',
    nombre: 'MARIO ALBERTO PÉREZ GÓMEZ',
    matricula: '20260303567',
    carrera: 'Contaduría Pública',
    rvoe: 'ES183/2004',
    vigencia: 'AGO 2027'
  });

  panelActivo = signal<'NINGUNO' | 'VIGENCIA' | 'FORMATOS' | 'AGREGAR_FORMATO'>('NINGUNO');
  tipoCodigo = signal<'BARRAS' | 'QR'>('QR');

  qrDataUrl = computed(() => {
    const matricula = encodeURIComponent(this.alumno().matricula.trim());
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&ecc=L&margin=0&color=000000&bgcolor=ffffff&data=${matricula}`;
  });

  ngOnInit(): void {
    this.cargarFormatosGuardados();
  }

  private crearPlantillaAlternativaLimpia(): string {
    if (typeof document === 'undefined') return '/img/Group%202029.png';

    const canvas = document.createElement('canvas');
    canvas.width = 534;
    canvas.height = 824;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '/img/Group%202029.png';

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 534, 824);

    const grad = ctx.createLinearGradient(0, 0, 534, 340);
    grad.addColorStop(0, '#0B2859');
    grad.addColorStop(1, '#174276');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(534, 0);
    ctx.lineTo(534, 295);
    ctx.quadraticCurveTo(267, 355, 0, 295);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(0, 299);
    ctx.quadraticCurveTo(267, 359, 534, 299);
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 34px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('UNIVERSIDAD IVES', 267, 95);

    ctx.fillStyle = '#fde047';
    ctx.font = 'bold 17px Arial, sans-serif';
    ctx.fillText('CREDENCIAL OFICIAL', 267, 130);

    ctx.fillStyle = '#0B2859';
    ctx.fillRect(0, 810, 534, 14);

    return canvas.toDataURL('image/png');
  }

  private async cargarFormatosGuardados(): Promise<void> {
    try {
      const resp = await fetch(this.API_URL).catch(() => fetch('/img/formatos/formatos.json'));
      if (resp && resp.ok) {
        const guardados: FormatoCredencial[] = await resp.json();
        if (!Array.isArray(guardados) || guardados.length === 0) return;

        this.formatos.update(actuales => {
          const mapa = new Map<string, FormatoCredencial>(actuales.map(f => [f.id, f]));
          for (const item of guardados) {
            mapa.set(item.id, item);
          }
          return Array.from(mapa.values());
        });

        const activo = this.formatos().find(f => f.id === this.formatoActivoId());
        if (activo) {
          this.fondoFrente = activo.frente;
        }
      }
    } catch {
      console.warn('No se encontraron formatos guardados en el servidor aún.');
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

    if (this.panelActivo() === 'AGREGAR_FORMATO') {
      this.restaurarVistaPreviaActual();
    }

    this.panelActivo.update(actual => (actual === panel ? 'NINGUNO' : panel));
  }

  iniciarEdicionFormatoActivo(): void {
    const actual = this.formatos().find(f => f.id === this.formatoActivoId());
    if (!actual) return;

    this.editandoFormatoId.set(actual.id);
    this.nuevoNombreFormato.set(actual.nombre);
    this.nuevoFrenteBase64.set(actual.frente);
    this.nombreArchivoFrente.set(
      actual.frente.startsWith('data:') ? `${actual.nombre}.png` : actual.frente.split('/').pop() || 'Plantilla actual'
    );
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
      this.procesarImagenComoPng(file);
    }
  }

  onArchivoSeleccionado(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.procesarImagenComoPng(file);
    input.value = '';
  }

  private procesarImagenComoPng(file: File): void {
    this.errorFormularioFormato.set('');
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const pngBase64 = canvas.toDataURL('image/png');
          this.nuevoFrenteBase64.set(pngBase64);
          this.nombreArchivoFrente.set(file.name.replace(/\.[^.]+$/, '') + '.png');
          this.fondoFrente = pngBase64;
        }
      };
      img.src = reader.result as string;
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

  async guardarFormato(): Promise<void> {
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

    this.guardando.set(true);
    this.errorFormularioFormato.set('');

    try {
      const respuesta = await fetch(this.API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: idEnEdicion,
          nombre,
          imagenBase64: frente
        })
      });

      if (!respuesta.ok) {
        throw new Error('Error en el servidor');
      }

      const formatoGuardado: FormatoCredencial = await respuesta.json();

      const listaActualizada = idEnEdicion
        ? this.formatos().map(f => (f.id === idEnEdicion ? formatoGuardado : f))
        : [...this.formatos(), formatoGuardado];

      this.formatos.set(listaActualizada);
      this.formatoActivoId.set(formatoGuardado.id);
      this.fondoFrente = formatoGuardado.frente;

      this.editandoFormatoId.set(null);
      this.nuevoNombreFormato.set('');
      this.nuevoFrenteBase64.set('');
      this.nombreArchivoFrente.set('');
      this.panelActivo.set('NINGUNO');
    } catch {
      this.errorFormularioFormato.set('Enciende el servidor con: node server-formatos.js');
    } finally {
      this.guardando.set(false);
    }
  }

  alternarCodigo(tipo?: 'BARRAS' | 'QR'): void {
    this.tipoCodigo.update(actual => tipo ?? (actual === 'BARRAS' ? 'QR' : 'BARRAS'));
  }

  onErrorImagen(event: Event): void {
    (event.target as HTMLImageElement).style.display = 'none';
  }

  imprimirCredencial(): void {
    this.panelActivo.set('NINGUNO');

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